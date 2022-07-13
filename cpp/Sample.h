
struct Object
{
    float x;
    float y;
    float w;
    float h;
    int label;
    float prob;
};


extern "C" int detect_yolo(const unsigned char* rgba_data, int width, int height, std::vector<Object>& objects);  
