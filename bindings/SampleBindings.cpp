#include <emscripten.h>
#include <emscripten/bind.h>
#include "Sample.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(Sample) {
    function("add", optional_override([](int a, int b) -> int {
        return Sample::add(a, b);
    }));
}