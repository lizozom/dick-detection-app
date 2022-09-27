pushd ~/Projects/ncnn/emsdk

./emsdk install latest
./emsdk activate latest
cd ..
source emsdk/emsdk_env.sh
popd
source ./tools/clear_app.sh
emcmake cmake -DBUILD_FOR=android
emmake make
emcmake cmake -DBUILD_FOR=ios-new
emmake make
emcmake cmake -DBUILD_FOR=ios-old
emmake make
