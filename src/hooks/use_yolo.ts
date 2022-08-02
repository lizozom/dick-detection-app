import * as React from 'react';
import { useState, useEffect } from 'react';
import { simd, threads } from 'wasm-feature-detect';
import ReactGA from 'react-ga4';

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

      ReactGA.event({
        category: 'ml',
        action: 'use_yolo',
        nonInteraction: true,
      });

      var wasmModuleLoaded = false;
      const wasmModuleLoadedCallbacks: Array<()=> void> = [];

      Module.onRuntimeInitialized = function() {
          ReactGA.event({
            category: 'ml',
            action: 'runtime_init',
            nonInteraction: true,
          });
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
              // console.log('simd&threads enabled.');
          }
          else
          {
              yolo_module_name = 'ios/yolo-ios';
              console.error('cannot enable simd&threads.');
          }

          ReactGA.event({
            category: 'ml',
            action: 'wasm_module_choice',
            label: yolo_module_name,
            nonInteraction: true,
          });

          // console.log('load ' + yolo_module_name);

          var yolowasm = yolo_module_name + '.wasm';
          var yolojs = yolo_module_name + '.js';

          fetch(yolowasm)
          .then(response => response.arrayBuffer())
          .then(buffer => {
              ReactGA.event({
                category: 'ml',
                action: 'wasm_buffer_loaded',
                label: yolo_module_name,
                nonInteraction: true,
              });
              Module.wasmBinary = buffer;
              var script = document.createElement('script');
              script.src = yolojs;
              script.onload = function() {
                  ReactGA.event({
                    category: 'ml',
                    action: 'wasm_loaded',
                    label: yolo_module_name,
                    nonInteraction: true,
                  });
                  console.log('Emscripten boilerplate loaded.');
                  setLoaded(true);
              }
              script.onerror = function() {
                ReactGA.event({
                  category: 'ml',
                  action: 'wasm_script_load_error',
                  label: yolo_module_name,
                  nonInteraction: true,
                });
              }
              document.body.appendChild(script);
          }).catch(() => {
            ReactGA.event({
              category: 'ml',
              action: 'wasm_buffer_load_error',
              label: yolo_module_name,
              nonInteraction: true,
            });
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