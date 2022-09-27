#pragma once

#include <vector>
#include "model.h"
#include "ncnn-base/include/ncnn/layer.h"
#include "ncnn-base/include/ncnn/net.h"


struct Dimension
{
    float w;
    float h;
};

void model_to_detections(ncnn::Mat out, int width, int height, std::vector<DetectionObject>& objects);
void load_yolo(ncnn::Net* yolo);
Dimension get_scaled_size(int width, int height);
Dimension get_padding(Dimension scaledSize);
void fill_result_buffer(std::vector<DetectionObject>& objects, float* result_buffer);