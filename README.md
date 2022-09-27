# DickDetection App: Real-time In-browser Dick Detection

### TL;DR 

This React app uses the model trained in [dick-detector-model](https://github.com/lizozom/dick-detector-model) and utilises ncnn and WebAssembly to perform in browser inference. 

This code is used by [duckpuc.com](https://duckpuc.com) to detect dicks on edge devices and apply amusing filters to them.

## Using the model

In the previous part of [this setup](https://github.com/lizozom/dick-detector-model), we have trained a model and exported it in `Darknet` format. Copy the `param` and `bin` files into the `cpp\assets` folder.

## Building ncnn

In the previous part of [this setup](https://github.com/lizozom/dick-detector-model), we have built `ncnn`, but only to use its tools. In this step we're going to build it with different parameters, to link with our WASM code. 

To start, define an evironment variable to the path where ncnn is installed on your machine.

```
export NCNN_PATH=MY_NCNN_PATH
```

Also, allow the execution of the tools in this project:

```
chmod u+x /tools/*.sh
```

# Installing EMScripten

Open your `ncnn` directory and clone `emsdk` inside it

```
git clone https://github.com/emscripten-core/emsdk.git
```

### Building ncnn for device support

The `dick-detection-app` is built to run on as many mobile devices as possible, however since WASM is a relatively new technology, not all devices fully support all of its features, specifically `pthread` and `simd`:
 - `pthread` allows running tasks in a separate thread. Supported on Android and [iOS 15.2+](https://webkit.org/blog/12140/new-webkit-features-in-safari-15-2/).
 - `simd` allows procssing multiple data within a single instruction. It is currently [not supported on iOS](https://github.com/ispc/ispc/issues/2127).

![wasm-support.png](https://web-dev.imgix.net/image/9oK23mr86lhFOwKaoYZ4EySNFp02/2HAGqxkbSoNhK03itXBK.png)

Run the following code to build `ncnn` in 3 modes: with both `pthread` and `simd` enabled, with only `pthread` enabled and with neither `pthread` nor `simd` enabled.

```
./tools/build_ncnn.sh
./tools/ncnn_update.sh
```

> :heavy_check_mark: **Check**
> 
> By the end of this step you should have three new folders: `cpp\ncnn-base`, `cpp\ncnn-ios-new` and `cpp\ncnn-ios-old`.
> Each should contain an `include` and a `lib` folder.

### Build WASM

Once ncnn is built, you can compile the wasm modules, by running

```
./tools/wasm_build.sh

```

> :heavy_check_mark: **Check**
> 
> By the end of this step you should have freshly built `wasm` modules in the `public` folder.

## Running the app
