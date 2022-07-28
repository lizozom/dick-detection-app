import * as React from 'react';
import { useState, useEffect } from 'react';
import { simd, threads } from 'wasm-feature-detect';

interface WasmModule {
  onRuntimeInitialized?: () => void;
  wasmBinary?: ArrayBuffer;
}

export function useYolo() {
    const [loaded, setLoaded] = useState(false);

    // wrap wasm
    useEffect(() => {
      var Module: WasmModule = {};
      let has_simd: boolean = false;
      let has_threads: boolean = false;
      let yolo_module_name: string = '';

      var wasmModuleLoaded = false;
      const wasmModuleLoadedCallbacks: Array<()=> void> = [];

      Module.onRuntimeInitialized = function() {
          wasmModuleLoaded = true;
          for (var i = 0; i < wasmModuleLoadedCallbacks.length; i++) {
              wasmModuleLoadedCallbacks[i]();
          }
      }

      simd().then(simdSuppoted => {
        has_simd = simdSuppoted;
        threads().then(threadsSupported => {
          has_threads = threadsSupported;

          if (has_simd && has_threads)
          {
              yolo_module_name = 'Sample';
              console.log('simd&threads enabled.');
          }
          else
          {
              yolo_module_name = 'ios/yolo-ios';
              console.error('cannot enable simd&threads.');
          }

          console.log('load ' + yolo_module_name);

          var yolowasm = yolo_module_name + '.wasm';
          var yolojs = yolo_module_name + '.js';

          fetch(yolowasm)
          .then(response => response.arrayBuffer())
          .then(buffer => {
              Module.wasmBinary = buffer;
              var script = document.createElement('script');
              script.src = yolojs;
              script.onload = function() {
                  console.log('Emscripten boilerplate loaded.');
                  setLoaded(true);
              }
              document.body.appendChild(script);
          });

        })
      });

      // console.log(Yolo)
      // debugger;
      //   const yolo = Yolo.then(wat => {
      //     delete wat['then'];
      //     debugger;
      //   })
        
        // ({
        //     locateFile: () => {
        //         return YoloWASM;
        //     },
        // });
        
        // yolo.then((core) => {
        //   const wrapped = {
        //     cw_detect_yolo: core.cwrap('detect_yolo', 'number', ['number', 'number', 'number', 'number']),
        //     ...core,
        //   }
        //   setYolo(wrapped);
        // });
      }, []);

      return loaded;
}