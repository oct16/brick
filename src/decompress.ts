import { AnyJson, BrickJsonResult } from './types'

export class BrickJsonDecompress {
    private defaultOptions = { ai: '$', si: ',' }

    private keysMap: Map<string, number> = new Map()
    private indexMap: Map<number, string> = new Map()
    result: AnyJson
    options: { si: string; ai: string }

    constructor(brickJson: [{ si?: string; ai?: string }, BrickJsonResult, BrickJsonResult] | [BrickJsonResult, BrickJsonResult]) {
        let kIndex = 0
        let vIndex = 1
        this.options = this.defaultOptions
        if (Object.prototype.toString.call(brickJson[0]).slice(8, 14) === 'Object') {
            this.options = { ...this.defaultOptions, ...(brickJson[0] as Partial<{ si: string; ai: string }>) }
            kIndex++
            vIndex++
        }

        const keys = brickJson[kIndex] as BrickJsonResult[]
        const values = brickJson[vIndex] as BrickJsonResult
        this.result = this.convert2Json(keys, values)
    }

    convert2Json(keys: BrickJsonResult[], values: BrickJsonResult) {
        if (!keys || !Array.isArray(keys) || !values || !Array.isArray(values)) {
            throw new Error('Params is not valid')
        }

        const ks = keys.slice() as Array<BrickJsonResult & { i: number }>

        keys.forEach((item, index) => {
            ks[index].i = index
            const key = item.join(this.options.si)
            this.keysMap.set(key, index)
            this.indexMap.set(index, key)
        })

        while (ks.length) {
            const keyItem = ks.shift()!
            const i = keyItem.i

            const preKey = keyItem.join(this.options.si)
            for (const [index, key] of keyItem.entries()) {
                if (typeof key === 'number') {
                    const uniqueKey = this.indexMap.get(key)!
                    keyItem[index] = uniqueKey.split(this.options.si)
                }
            }
            const newKey = keyItem.flat().join(this.options.si)
            if (preKey !== newKey) {
                this.keysMap.delete(preKey)
                this.keysMap.set(newKey, i)
                this.indexMap.set(i, newKey)
            }
        }

        return this.convertObj(values)
    }

    convertObj(item: BrickJsonResult) {
        if (Array.isArray(item)) {
            const firstOne = item[0]
            if (firstOne === this.options.ai) {
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
            const keys = keyStr.split(this.options.si)
            const values = item.slice(1)
            keys.forEach((key, i) => {
                const val = values[i]
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
