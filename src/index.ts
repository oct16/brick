import { AnyJson, BrickJsonResult } from './types'
import { BrickJsonDecompress } from './decompress'
import { BrickJsonCompress } from './compress'

export function compress(json: AnyJson, options?: Partial<{ reduceValues: boolean; arrayIdentifier: string }>) {
    const { result } = new BrickJsonCompress(json, options)
    return result
}
export function decompress(brickJson: BrickJsonResult, options?: Partial<{ arrayIdentifier: string }>) {
    const { result } = new BrickJsonDecompress(brickJson, options)
    return result
}
