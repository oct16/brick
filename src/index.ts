import { AnyJson, BrickJsonResult } from './types'
import { BrickJsonDecompress } from './decompress'
import { BrickJsonCompress } from './compress'

export function compress(json: AnyJson, options?: Partial<{ arrayIdentifier: string; separatorIdentifier: string }>) {
    const { result } = new BrickJsonCompress(json, options)
    return result
}
export function decompress(
    brickJson: [{ si?: string; ai?: string }, BrickJsonResult, BrickJsonResult] | [BrickJsonResult, BrickJsonResult]
) {
    const { result } = new BrickJsonDecompress(brickJson)
    return result
}
