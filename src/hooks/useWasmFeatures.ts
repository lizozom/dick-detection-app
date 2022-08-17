import { useEffect, useState } from "react";
import { simd, threads } from 'wasm-feature-detect'

export function useWasmFeatures() {
    const [simdAllowed, setSimd] = useState<boolean | undefined>(undefined);
    const [threadsAllowed, setThreads] = useState<boolean | undefined>(undefined);
    useEffect(() => {        
      simd().then((simdSuppoted) => {
        setSimd(simdSuppoted);
      })
      threads().then((threadsSupported) => {
        setThreads(threadsSupported);

      })
    }, []);

    return {simd: simdAllowed, threads: threadsAllowed};

}