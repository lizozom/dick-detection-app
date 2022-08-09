import * as React from 'react'
import { useState, useEffect } from 'react'
import { simd, threads } from 'wasm-feature-detect'
import ReactGA from 'react-ga4'

interface WasmModule {
  onRuntimeInitialized?: () => void;
  postRun?: () => void;
  wasmBinary?: ArrayBuffer
}

declare global {
  interface Window {
    Module: WasmModule;
  }
}

export function useYolo() {
  // const [wasmRuntimeInit, setWasmRuntimeInit] = useState(false);
  const [loaded, setLoaded] = useState(false)
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

    var Module: WasmModule = {}

    window.Module = Module;

    Module.onRuntimeInitialized = function () {
      reportEvent('runtime_init')
      setLoaded(true)
    }

    reportEvent('wasm_module_choice');

    var yolowasm = yoloModuleName + '.wasm'
    var yolojs = yoloModuleName + '.js'

    fetch(yolowasm)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        reportEvent('wasm_buffer_loaded')
        Module.wasmBinary = buffer
        var script = document.createElement('script')
        script.src = yolojs
        script.onload = function () {
          reportEvent('wasm_loaded')
          console.log('Emscripten boilerplate loaded.')
        }
        script.onerror = function () {
          setError('Failed to load wasm script')
          reportEvent('wasm_script_load_error')
        }
        document.body.appendChild(script)
      })
      .catch(() => {
        setError('Failed to load script buffer')
        reportEvent('wasm_buffer_load_error')
      })
  }, [yoloModuleName]);

  return { loaded, error }
}
