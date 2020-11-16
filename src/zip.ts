import { AnyJson, BrickJsonBasic, BrickJsonResult, JsonArray, JsonMap } from './types'

export class BrickJsonZip {
    private arrayIdentifier = '$'
    keys: (string | number)[][] = []
    result: BrickJsonResult = []
    json: AnyJson
    private keyMap: Map<string, number> = new Map()
    private indexMap: Map<number, string> = new Map()

    constructor(json: AnyJson, arrayIdentifier?: string) {
        this.json = json
        arrayIdentifier && (this.arrayIdentifier = arrayIdentifier)
        this.startConvert()
    }

    compress() {}

    decompress(): void {}

    startConvert() {
        const data = this.json
        if (Array.isArray(data)) {
            this.result.push(...this.deepConvertArray(data, false))
            return
        }
        this.result.push(this.deepConvertObj(data as JsonMap))
    }

    deepConvertArray(jsonArray: JsonArray, isChild = true) {
        const res: BrickJsonResult = [isChild ? this.arrayIdentifier : ''].filter(Boolean)
        jsonArray.forEach(item => {
            const type = typeof item
            if (Array.isArray(item)) {
                res.push(...this.deepConvertArray(item))
            } else if (item !== null && type === 'object') {
                res.push(this.deepConvertObj(item as JsonMap))
            } else {
                res.push(item as BrickJsonBasic)
            }
        })
        return res
    }

    deepConvertObj(obj: JsonMap) {
        const res: BrickJsonResult = []
        if (obj === null) {
            return null
        } else if (typeof obj === 'boolean') {
            return obj
        }
        const objKeys = Object.getOwnPropertyNames(obj).sort()
        const uniqueKey = objKeys.join()
        if (uniqueKey === '') {
            return res
        }
        const objValues = objKeys.map(key => obj[key])

        if (this.keys.length) {
            const latestKey = this.getLastKeyInMap()
            for (const [key, index] of this.keyMap) {
                if (uniqueKey === key) {
                    const confirmIndex = this.keyMap.get(uniqueKey)!
                    res.unshift(confirmIndex)
                    break
                }

                const text = uniqueKey.length > key.length ? uniqueKey : key
                const sub = uniqueKey.length > key.length ? key : uniqueKey
                const nextIndex = this.keys.length

                // a part of keys matches
                if (~text.indexOf(sub)) {
                    const i = text.indexOf(sub)
                    const str = text.substring(i + sub.length)
                    const otherPart = str.split(',').filter(Boolean)
                    const uniqueKey = [index, ...otherPart].map(k => (typeof k === 'number' ? this.getBy(k) : k)).join()
                    const isKeyExist = this.getBy(uniqueKey) !== undefined
                    if (!isKeyExist) {
                        this.keys.push([index, ...otherPart])
                        res.unshift(nextIndex)
                    }
                    break
                } else if (latestKey === key) {
                    // None of keys matches
                    this.keys.push([...objKeys])
                    res.unshift(nextIndex)
                    break
                }
            }
        } else {
            res.unshift(this.saveKey(uniqueKey))
            this.keys.push(objKeys)
        }

        objValues.forEach(val => {
            const type = typeof val
            if (type === 'string' || type === 'number' || val === null || type === 'boolean') {
                // if (type === 'string' || type === 'number') {
                res.push(val as string | number)
            } else if (Array.isArray(val)) {
                res.push(this.deepConvertArray(val))
            } else {
                res.push(this.deepConvertObj(val as JsonMap))
            }
        })

        this.saveKey(uniqueKey)
        return res
    }

    getLastKeyInMap = () => {
        const map = this.keyMap
        return Array.from(map)[map.size - 1][0]
    }

    saveKey(key: string, index = this.keys.length) {
        !this.keyMap.has(key) && this.keyMap.set(key, index)
        !this.indexMap.has(index) && this.indexMap.set(index, key)
        return index
    }

    getBy(target: string | number) {
        return typeof target === 'number' ? this.indexMap.get(target) : this.keyMap.get(target)
    }
}
