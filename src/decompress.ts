import { AnyJson, BrickJsonResult } from './types'

export class BrickJsonDecompress {
    private arrayIdentifier = '$'
    private keysMap: Map<string, number> = new Map()
    private indexMap: Map<number, string> = new Map()
    result: AnyJson

    constructor(brickJson: BrickJsonResult) {
        this.result = this.convert2Json(brickJson)
    }

    convert2Json(brickJson: BrickJsonResult) {
        if (!Array.isArray(brickJson) || brickJson.length !== 2) {
            throw new Error('Params is not valid')
        }
        const [keys, values] = brickJson as [BrickJsonResult[], BrickJsonResult]

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
                if (uniqueKey) {
                    const newKey = [uniqueKey, ...otherPart].join()
                    this.keysMap.set(newKey, i)
                    this.indexMap.set(i, newKey)
                    continue
                }
                ks.push(keyItem)
            }
        }

        const firstOne = values[0]
        if (typeof firstOne === 'number' || firstOne === this.arrayIdentifier) {
            return this.convertObj(values)
        }
        return this.convertArray(values)
    }

    convertObj(item: BrickJsonResult) {
        debugger
        if (Array.isArray(item)) {
            const firstOne = item[0]
            if (firstOne === this.arrayIdentifier) {
                // is Array
                const arr = item.slice(1)
                return this.convertArray(arr)
            }

            // is Object
            const len = item.length
            if (!len) {
                return {}
            }
            const keysRef = item[0] as number
            const keyStr = this.indexMap.get(keysRef)
            const obj: AnyJson = {}

            if (keyStr) {
                const keys = keyStr.split(',')
                const values = item.slice(1)

                keys.forEach((key, i) => {
                    const val = values[i]
                    obj[key] = Array.isArray(val) ? this.convertObj(val) : val
                })
            }
            return obj
        }

        if (item !== this.arrayIdentifier) {
            return item
        }
    }

    convertArray(array: BrickJsonResult) {
        const res: Array<AnyJson> = []
        array.forEach(item => {
            res.push(this.convertObj(item as BrickJsonResult))
        })
        return res
    }
}
