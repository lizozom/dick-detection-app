
#include "ncnn-ios/include/ncnn/layer.h"
#include "ncnn-ios/include/ncnn/net.h"

#include <stdlib.h>
#include <float.h>
#include <stdio.h>
#include <vector>

#include "duckpuc.h"

static ncnn::Net* yolo = 0;

extern "C" {

int detect_yolo(const unsigned char* rgba_data, int width, int height, std::vector<Object>& objects) {
    // fprintf(stdout, "input %d x %d\n", width, height);

    if (!yolo)
    {
        yolo = new ncnn::Net;

        fprintf(stderr, "opt num_threads = %d\n", yolo->opt.num_threads);

        yolo->opt.use_vulkan_compute = true;
        // yolo->opt.use_bf16_storage = true;

        yolo->load_param("duckpuc-fastest2-opt.param");
        yolo->load_model("duckpuc-fastest2-opt.bin");
    }

    // fprintf(stdout, "initialized!\n");

    const int target_size = 320;

    // letterbox pad to multiple of 32
    int w = width;
    int h = height;
    float scale = 1.f;
    if (w > h)
    {
        scale = (float)target_size / w;
        w = target_size;
        h = h * scale;
    }
    else
    {
        scale = (float)target_size / h;
        h = target_size;
        w = w * scale;
    }

    ncnn::Mat in = ncnn::Mat::from_pixels_resize(rgba_data, ncnn::Mat::PIXEL_RGBA2RGB, width, height, w, h);

    // fprintf(stdout, "scaled %d x %d\n", w, h);

    // pad to target_size rectangle
    // yolo/utils/datasets.py letterbox
    int wpad = (w + 31) / 32 * 32 - w;
    int hpad = (h + 31) / 32 * 32 - h;
    ncnn::Mat in_pad;
    ncnn::copy_make_border(in, in_pad, hpad / 2, hpad - hpad / 2, wpad / 2, wpad - wpad / 2, ncnn::BORDER_CONSTANT, 114.f);

    const float norm_vals[3] = {1 / 255.f, 1 / 255.f, 1 / 255.f};
    in_pad.substract_mean_normalize(0, norm_vals);

    // fprintf(stdout, "normalized\n");

    ncnn::Extractor ex = yolo->create_extractor();

    ex.input("data", in_pad);
    ncnn::Mat out;
    ex.extract("output", out);
    
    int count = out.h;
    
//    // apply nms with nms_threshold
//    std::vector<int> picked;
//    nms_sorted_bboxes(proposals, picked, nms_threshold);

    // fprintf(stdout, "received %d items\n", count);
    objects.resize(count);
    for (int i = 0; i < count; i++)
    {
        int label;
        float x1, y1, x2, y2, score;
        float pw,ph,cx,cy;
        const float* values = out.row(i);
        
        x1 = values[2] * width;
        y1 = values[3] * height;
        x2 = values[4] * width;
        y2 = values[5] * height;


        score = values[1];
        label = values[0];

        // fprintf(stdout, "item %d:\n", i);
        // fprintf(stdout, "x1 %f x2 %f y1 %f y2 %f score %f label %d \n", x1, x2, y1, y2, score, label);

        //处理坐标越界问题
        if(x1<0) x1=0;
        if(y1<0) y1=0;
        if(x2<0) x2=0;
        if(y2<0) y2=0;

        if(x1>width) x1=width;
        if(y1>height) y1=height;
        if(x2>width) x2=width;
        if(y2>height) y2=height;
        
        objects[i].label = label;
        objects[i].prob = score;
        objects[i].x = x1;
        objects[i].y = y1;
        objects[i].w = x2 - x1;
        objects[i].h = y2 - y1;

        // fprintf(stdout, "x %f y %f w %f h %f\n", objects[i].x, objects[i].y, objects[i].w, objects[i].h);
        
    }
    return 0;
}
}

#include <emscripten.h>

// static const unsigned char* rgba_data = 0;
// static int w = 0;
// static int h = 0;
// static float* result_buffer = 0;

// static ncnn::Mutex lock;
// static ncnn::ConditionVariable condition;

// static ncnn::Mutex finish_lock;
// static ncnn::ConditionVariable finish_condition;

// static void worker()
// {
//     while (1)
//     {
//         lock.lock();
//         while (rgba_data == 0)
//         {
//             condition.wait(lock);
//         }

//         std::vector<Object> objects;
//         detect_yolo(rgba_data, w, h, objects);


//         // result_buffer max 20 objects
//         if (objects.size() > 20)
//             objects.resize(20);

//         size_t i = 0;
//         for (; i < objects.size(); i++)
//         {
//             const Object& obj = objects[i];

//             result_buffer[0] = obj.label;
//             result_buffer[1] = obj.prob;
//             result_buffer[2] = obj.x;
//             result_buffer[3] = obj.y;
//             result_buffer[4] = obj.w;
//             result_buffer[5] = obj.h;

//             result_buffer += 6;
//         }
//         for (; i < 20; i++)
//         {
//             result_buffer[0] = -233;
//             result_buffer[1] = -233;
//             result_buffer[2] = -233;
//             result_buffer[3] = -233;
//             result_buffer[4] = -233;
//             result_buffer[5] = -233;

//             result_buffer += 6;
//         }

//         rgba_data = 0;

//         lock.unlock();

//         finish_lock.lock();
//         finish_condition.signal();
//         finish_lock.unlock();
//     }
// }

// #include <thread>
// static std::thread t(worker);


static const unsigned char* rgba_data = 0;
static int w = 0;
static int h = 0;
static float* result_buffer = 0;

extern "C" {
    void yolo_ncnn(const unsigned char* _rgba_data, int _w, int _h, float* _result_buffer){
        rgba_data = _rgba_data;
        w = _w;
        h = _h;
        result_buffer = _result_buffer;

        std::vector<Object> objects;
        detect_yolo(rgba_data, w, h, objects); 

        // result_buffer max 20 objects
        if (objects.size() > 20)
            objects.resize(20);

        // copy to result buffer
        for (int i = 0; i < objects.size(); i++) {
            if (i < objects.size()) {
                const Object& obj = objects[i];

                result_buffer[0] = obj.label;
                result_buffer[1] = obj.prob;
                result_buffer[2] = obj.x;
                result_buffer[3] = obj.y;
                result_buffer[4] = obj.w;
                result_buffer[5] = obj.h;
            } else {
                result_buffer[0] = -233;
                result_buffer[1] = -233;
                result_buffer[2] = -233;
                result_buffer[3] = -233;
                result_buffer[4] = -233;
                result_buffer[5] = -233;
            }

            result_buffer += 6;
        }
    }
}
