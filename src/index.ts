import { AnyJson, BrickJsonResult } from './types'
import { BrickJsonDecompress } from './decompress'
import { BrickJsonCompress } from './compress'

export function compress(json: AnyJson) {
    const { result } = new BrickJsonCompress(json)
    return result
}
export function decompress(brickJson: BrickJsonResult) {
    const { result } = new BrickJsonDecompress(brickJson)
    return result
}
