#include <emscripten.h>
#include <emscripten/bind.h>
#include "../cpp/Sample.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(MyModule) {
    function("detect_yolo", optional_override([](const unsigned char* rgba_data, int width, int height, std::vector<Object>& objects) -> int {
        return detect_yolo(rgba_data, width, height, objects);
    }), allow_raw_pointers());
}