import { AnyJson } from '../types'
import pako from 'pako'
import { compress, decompress } from '..'

export function compressWithGzip(json: AnyJson): string {
    const result = compress(json)
    const buf = pako.gzip(JSON.stringify(result))
    return String.fromCharCode.apply(null, new Uint8Array(buf))
}

export function decompressWithGzip(str: string) {
    function str2ab(str: string) {
        const ab = new Uint8Array(str.length)
        for (let i = 0; i < str.length; i++) {
            ab[i] = str.charCodeAt(i)
        }
        return ab
    }
    const buf = str2ab(str)
    return decompress(JSON.parse(pako.ungzip(buf, { to: 'string' })))
}
