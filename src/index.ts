import { AnyJson, BrickJsonResult } from './types'
import { BrickJsonDecompress } from './decompress'
import { BrickJsonCompress } from './compress'

export const BrickJson = {
    compress(json: AnyJson) {
        const { result } = new BrickJsonCompress(json)
        return result
    },
    decompress(brickJson: BrickJsonResult) {
        const { result } = new BrickJsonDecompress(brickJson)
        return result
    }
}
