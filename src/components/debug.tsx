import * as React from 'react';
import { useEffect, useState } from 'react'
import { simd, threads } from 'wasm-feature-detect'

export function Debug() {
    const [wasmSettings, setWasmSettings] = useState<{
        simd: boolean;
        threads: boolean;
    } | undefined>();

    useEffect(() => {
        const testWasm = async () => {
            const simdEnabled = await simd();
            const threadsEnabled = await threads();

            setWasmSettings({
                simd: simdEnabled,
                threads: threadsEnabled,
            });
        }

        testWasm();
    }, []);

    return (
        <>
            <div>Simd {String(wasmSettings?.simd)}</div>
            <div>Threads {String(wasmSettings?.threads)}</div>
        </>
    )
}