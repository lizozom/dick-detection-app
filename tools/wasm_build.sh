./tools/clear_app.sh
emcmake cmake -DBUILD_FOR=android
emmake make
emcmake cmake -DBUILD_FOR=ios-new
emmake make
emcmake cmake -DBUILD_FOR=ios-old
emmake make
