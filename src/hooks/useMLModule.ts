import { useEffect, useState } from "react";


async function loadModuleScript(src: string, moduleFnName: string) {
    return new Promise<void>((resolve, reject) => {
        // if already loaded, resolve immediately
        if (window.hasOwnProperty(moduleFnName)) resolve();

        var script = document.createElement('script')
        script.src = src;
        script.onload = async function () {
            resolve();
        }
        script.onerror = function () {
            reject();
        }
        document.body.appendChild(script);
    });
}

export function useMLMoudle<T extends EmscriptenModule>(moduleName?: string, moduleFnName?: string) {
    const [module, setModule] = useState<T>();
    const [error, setError] = useState<string>();


    // wrap wasm
    useEffect(() => {
        if (!moduleName || !moduleFnName) return;

        const loadModule = async () => {

            try {
                const modulejs = moduleName + '.js'
                await loadModuleScript(modulejs, moduleFnName);

                // @ts-ignore
                const loaderFn: () => Promise<T> = window[moduleFnName];
                const module = await loaderFn()
                setModule(module);
                console.log('Emscripten boilerplate loaded.')
            } catch (e) {
                setError('Failed to load script buffer')
            }
        }

        loadModule();
    }, [moduleName, moduleFnName]);

    return { module, error}
}