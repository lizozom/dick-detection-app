import * as React from 'react'
import { useState, useEffect } from 'react'
import { simd, threads } from 'wasm-feature-detect'
import ReactGA from 'react-ga4'
import { isWasmLoaded } from '../helpers';

export interface YoloModel extends EmscriptenModule {
  _yolo_ncnn(dst: any, width: number, height: number, resultbuffer: any): number
}

declare function createYoloModule(): Promise<YoloModel>

async function loadYoloScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    // if already loaded, resolve immediately
    if (window.hasOwnProperty('createYoloModule')) resolve();

    var script = document.createElement('script')
    script.src = src
    script.onload = async function () {
      resolve();
    }
    script.onerror = function () {
      reject();
    }
    document.body.appendChild(script);
  });
}

export function useYolo() {
  const [yolo, setYolo] = useState<YoloModel>()
  const [yoloModuleName, setYoloModuleName] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>(undefined)

  const reportEvent = (action: string) => {
    ReactGA.event({
      category: 'ml',
      action,
      label: yoloModuleName,
      nonInteraction: true,
    })
  }

  useEffect(() => {    
    reportEvent('use_yolo');

    let has_simd: boolean = false
    let has_threads: boolean = false

    simd().then((simdSuppoted) => {
      has_simd = simdSuppoted
      threads().then((threadsSupported) => {
        has_threads = threadsSupported

        if (has_simd && has_threads) {
          setYoloModuleName('duckpuc')
        } else if (has_threads) {
          setYoloModuleName('duckpuc-ios-new')
        } else {
          setYoloModuleName('duckpuc-ios-old')
        }
      })
    })
  }, [])

  // wrap wasm
  useEffect(() => {
    if (!yoloModuleName) return;

    reportEvent('wasm_module_choice');

    const loadYolo = async () => {

      try {
        const yolojs = yoloModuleName + '.js'
        await loadYoloScript(yolojs);

        const module = await createYoloModule()
        setYolo(module);
        reportEvent('wasm_loaded')
        console.log('Emscripten boilerplate loaded.')
      } catch (e) {
        setError('Failed to load script buffer')
        reportEvent('wasm_buffer_load_error')
      }
    }

    loadYolo();
  }, [yoloModuleName]);

  return { yolo, error }
}
