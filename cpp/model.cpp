
#include "ncnn-base/include/ncnn/layer.h"
#include "ncnn-base/include/ncnn/net.h"

#include <stdlib.h>
#include <float.h>
#include <stdio.h>
#include <vector>

#include "model.h"
#include "model-helpers.h"

static ncnn::Net* yolo = 0;

extern "C" {

int detect_yolo(const unsigned char* rgba_data, int width, int height, std::vector<DetectionObject>& objects) {
    // fprintf(stdout, "input %d x %d\n", width, height);

    if (!yolo)
    {
        yolo = new ncnn::Net;
        load_yolo(yolo);
    }

    Dimension scaledSize = get_scaled_size(width, height);
    Dimension padding = get_padding(scaledSize);

    ncnn::Mat in = ncnn::Mat::from_pixels_resize(rgba_data, ncnn::Mat::PIXEL_RGBA2RGB, width, height, scaledSize.w, scaledSize.h);
    ncnn::Mat in_pad;
    ncnn::copy_make_border(in, in_pad, padding.h / 2, padding.h - padding.h / 2, padding.w / 2, padding.w - padding.w / 2, ncnn::BORDER_CONSTANT, 114.f);

    const float norm_vals[3] = {1 / 255.f, 1 / 255.f, 1 / 255.f};
    in_pad.substract_mean_normalize(0, norm_vals);

    // fprintf(stdout, "normalized\n");

    ncnn::Extractor ex = yolo->create_extractor();

    ex.input("data", in_pad);
    ncnn::Mat out;
    ex.extract("output", out);
    
    model_to_detections(out, width, height, objects);
    return 0;
}
}

#include <emscripten.h>

static const unsigned char* rgba_data = 0;
static int w = 0;
static int h = 0;
static float* result_buffer = 0;

static ncnn::Mutex lock;
static ncnn::ConditionVariable condition;

static ncnn::Mutex finish_lock;
static ncnn::ConditionVariable finish_condition;

static void worker()
{
    while (1)
    {
        lock.lock();
        while (rgba_data == 0)
        {
            condition.wait(lock);
        }

        std::vector<DetectionObject> objects;
        detect_yolo(rgba_data, w, h, objects);


        // result_buffer max 20 objects
        if (objects.size() > 20)
            objects.resize(20);

        size_t i = 0;
        for (; i < objects.size(); i++)
        {
            const DetectionObject& obj = objects[i];

            result_buffer[0] = obj.label;
            result_buffer[1] = obj.prob;
            result_buffer[2] = obj.x;
            result_buffer[3] = obj.y;
            result_buffer[4] = obj.w;
            result_buffer[5] = obj.h;

            result_buffer += 6;
        }
        for (; i < 20; i++)
        {
            result_buffer[0] = -233;
            result_buffer[1] = -233;
            result_buffer[2] = -233;
            result_buffer[3] = -233;
            result_buffer[4] = -233;
            result_buffer[5] = -233;

            result_buffer += 6;
        }

        rgba_data = 0;

        lock.unlock();

        finish_lock.lock();
        finish_condition.signal();
        finish_lock.unlock();
    }
}

#include <thread>
static std::thread t(worker);

extern "C" {
    void yolo_ncnn(const unsigned char* _rgba_data, int _w, int _h, float* _result_buffer)
    {
        lock.lock();
        while (rgba_data != 0)
        {
            condition.wait(lock);
        }

        rgba_data = _rgba_data;
        w = _w;
        h = _h;
        result_buffer = _result_buffer;

        lock.unlock();

        condition.signal();

        // wait for finished
        finish_lock.lock();
        while (rgba_data != 0)
        {
            finish_condition.wait(finish_lock);
        }
        finish_lock.unlock();
    }

}
