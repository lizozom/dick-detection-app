emcc --bind bindings/SampleBindings.cpp -Icpp/ cpp/*.cpp cpp/ncnn/lib/libncnn.a -s WASM=1 -s MODULARIZE=1 -o Sample.js --no-entry --preload-file cpp/assets@/ -s EXPORTED_FUNCTIONS="['_detect_yolo']"
