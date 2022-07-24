export function isWasmLoaded() {
    return window.hasOwnProperty('HEAP8');
}