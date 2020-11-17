import { AnyJson, BrickJsonResult } from './types'
import { BrickJsonUnzip } from './unzip'
import { BrickJsonZip } from './zip'

export const BrickJson = {
    zip(json: AnyJson) {
        const zipped = new BrickJsonZip(json)
        return [zipped.keys, zipped.result]
    },
    unzip(brickJson: BrickJsonResult) {
        return new BrickJsonUnzip(brickJson)
    }
}
