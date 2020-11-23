import { AnyJson } from '../types'
import pako from 'pako'
import { compress, decompress } from '..'

export function compressWithGzip(json: AnyJson, options?: Partial<{ arrayIdentifier: string; separatorIdentifier: string }>): string {
    const result = compress(json, options)
    const buf = pako.gzip(JSON.stringify(result))
    const uint8Array = new Uint8Array(buf)
    return uint8Array.reduce((acc, i) => (acc += String.fromCharCode.apply(null, [i])), '')
}

export function decompressWithGzip(str: string) {
    function str2ab(str: string) {
        const ab = new Uint8Array(str.length)
        for (let i = 0; i < str.length; i++) {
            ab[i] = str.charCodeAt(i)
        }
        return ab
    }
    return decompress(JSON.parse(pako.ungzip(str2ab(str), { to: 'string' })))
}
