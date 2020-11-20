import { AnyJson } from '../types'
import pako from 'pako'
import { compress, decompress } from '..'

export function compressWithGzip(json: AnyJson, options?: Partial<{ reduceValues: boolean; arrayIdentifier: string }>): string {
    const result = compress(json, options)
    const buf = pako.gzip(JSON.stringify(result))
    return String.fromCharCode.apply(null, new Uint8Array(buf))
}

export function decompressWithGzip(str: string, options?: Partial<{ arrayIdentifier: string }>) {
    function str2ab(str: string) {
        const ab = new Uint8Array(str.length)
        for (let i = 0; i < str.length; i++) {
            ab[i] = str.charCodeAt(i)
        }
        return ab
    }
    return decompress(JSON.parse(pako.ungzip(str2ab(str), { to: 'string' })), options)
}
