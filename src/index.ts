import { BrickJsonUnzip } from './unzip'
import { BrickJsonZip } from './zip'

type AnyJson = boolean | number | string | null | undefined | JsonArray | JsonMap
interface JsonMap {
    [key: string]: AnyJson
}
type JsonArray = Array<AnyJson>

type BrickJsonResult = Array<BrickJsonBasic | BrickJsonResult>
type BrickJsonBasic = string | number | null | undefined

export const BrickJson = {
    zip(json: AnyJson) {
        const zipped = new BrickJsonZip(json)
        return [zipped.keys, zipped.result]
    },
    unzip(brickJson: BrickJsonResult) {
        return new BrickJsonUnzip(brickJson)
    }
}
