import { AnyJson, BrickJsonBasic, BrickJsonResult } from './types'

export class BrickJsonDecompress {
    private arrayIdentifier = '$'
    private keysMap: Map<string, number> = new Map()
    private indexMap: Map<number, string> = new Map()
    private vKeys: BrickJsonBasic[] = []
    result: AnyJson
    reduceValues: boolean

    constructor(brickJson: BrickJsonResult, options?: Partial<{ arrayIdentifier: string }>) {
        const { arrayIdentifier } = options || {}
        arrayIdentifier && (this.arrayIdentifier = arrayIdentifier)
        this.result = this.convert2Json(brickJson)
    }

    convert2Json(brickJson: BrickJsonResult) {
        if (!Array.isArray(brickJson) || brickJson.length < 2 || brickJson.length > 3) {
            throw new Error('Params is not valid')
        }
        const keys = brickJson[0] as BrickJsonResult[]
        let vKeys: BrickJsonBasic[]
        let values: BrickJsonResult

        if (brickJson.length === 3) {
            vKeys = brickJson[1] as BrickJsonBasic[]
            values = brickJson[2] as BrickJsonResult
            this.vKeys = vKeys
            this.reduceValues = true
        } else {
            values = brickJson[1] as BrickJsonResult
        }

        const ks = keys.slice() as Array<BrickJsonResult & { i: number }>

        keys.forEach((item, index) => {
            ks[index].i = index
            const key = item.join()
            this.keysMap.set(key, index)
            this.indexMap.set(index, key)
        })

        while (ks.length) {
            const keyItem = ks.shift()!
            const i = keyItem.i
            const firstPart = keyItem[0]
            const otherPart = keyItem.slice(1) as string[]
            if (typeof firstPart === 'number') {
                const uniqueKey = this.indexMap.get(firstPart)
                const newKey = [uniqueKey, ...otherPart].join()
                this.keysMap.set(newKey, i)
                this.indexMap.set(i, newKey)
                continue
            }
        }

        return this.convertObj(values)
    }

    convertObj(item: BrickJsonResult) {
        if (Array.isArray(item)) {
            const firstOne = item[0]
            if (firstOne === this.arrayIdentifier) {
                const arr = item.slice(1)
                return this.convertArray(arr)
            }

            const len = item.length
            if (!len) {
                return {}
            }
            const keysRef = item[0] as number
            const keyStr = this.indexMap.get(keysRef)!
            const obj: AnyJson = {}
            const keys = keyStr.split(',')
            const values = item.slice(1)
            keys.forEach((key, i) => {
                const value = values[i]
                const val = this.reduceValues && typeof value === 'number' ? this.vKeys[value] : value
                obj[key] = Array.isArray(val) ? this.convertObj(val) : val
            })
            return obj
        }
        return item
    }

    convertArray(array: BrickJsonResult) {
        const res: Array<AnyJson> = []
        array.forEach(item => {
            res.push(this.convertObj(item as BrickJsonResult))
        })
        return res
    }
}
