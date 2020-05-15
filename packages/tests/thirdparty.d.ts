declare module "web3-providers-http" {
    export class Web3HttpProvider {
        constructor(url: string | number);
    }
    export default Web3HttpProvider;
}

declare module "browserify-zlib" {
    export interface ZlibOptions {
        flush?: number;
        finishFlush?: number;
        chunkSize?: number;
        windowBits?: number;
        level?: number;
        memLevel?: number;
        strategy?: number;
        dictionary?: any;
    }

    type InputType = string | Buffer | DataView | ArrayBuffer;

    export function gzipSync(buf: InputType, options?: ZlibOptions): Buffer;
    export function gunzipSync(buf: InputType, options?: ZlibOptions): Buffer;
}
