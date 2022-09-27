#include <vector>
#include "model.h"
#include "model-helpers.h"
#include "ncnn-base/include/ncnn/layer.h"
#include "ncnn-base/include/ncnn/net.h"

/**
 * @brief Initializes the yolo model
 * 
 * @param yolo 
 */
void load_yolo(ncnn::Net* yolo) {
    fprintf(stderr, "opt num_threads = %d\n", yolo->opt.num_threads);

    yolo->opt.use_vulkan_compute = true;
    // yolo->opt.use_bf16_storage = true;

    yolo->load_param("duckpuc-fastest2-opt.param");
    yolo->load_model("duckpuc-fastest2-opt.bin");
}

/**
 * @brief Returns the images scaled to the target size of 320x320 pixels
 * 
 * @param width 
 * @param height 
 * @return ScaledSize 
 */
Dimension get_scaled_size(int width, int height) {
    const int target_size = 320;
    struct Dimension scaledSize;

    // letterbox pad to multiple of 32
    scaledSize.w = width;
    scaledSize.h = height;
    float scale = 1.f;
    if (scaledSize.w > scaledSize.h)
    {
        scale = (float)target_size / scaledSize.w;
        scaledSize.w = target_size;
        scaledSize.h = scaledSize.h * scale;
    }
    else
    {
        scale = (float)target_size / scaledSize.h;
        scaledSize.h = target_size;
        scaledSize.w = scaledSize.w * scale;
    }

    return scaledSize;
}

Dimension get_padding(Dimension scaledSize) {
    struct Dimension padding;
    padding.w = (scaledSize.w + 31) / 32 * 32 - scaledSize.w;
    padding.h = (scaledSize.h + 31) / 32 * 32 - scaledSize.h;
    return padding;
}

/**
 * @brief Builds a vector of detections from the ncnn output matrix
 * 
 * @param out 
 * @param width 
 * @param height 
 * @param objects 
 */
void model_to_detections(ncnn::Mat out, int width, int height, std::vector<DetectionObject>& objects) {
    int count = out.h;
    objects.resize(count);

    for (int i = 0; i < count; i++) {
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
}

void fill_result_buffer(std::vector<DetectionObject>& objects, float* result_buffer) {
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
}