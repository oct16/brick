import { AnyJson, BrickJsonResult } from './types'
import { BrickJsonUnzip } from './unzip'
import { BrickJsonZip } from './zip'

export const BrickJson = {
    zip(json: AnyJson) {
        const { result } = new BrickJsonZip(json)
        return result
    },
    unzip(brickJson: BrickJsonResult) {
        const { result } = new BrickJsonUnzip(brickJson)
        return result
    }
}
