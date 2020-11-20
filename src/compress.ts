import { AnyJson, BrickJsonBasic, BrickJsonResult, JsonArray, JsonMap } from './types'

export class BrickJsonCompress {
    private arrayIdentifier = '$'
    private keys: (string | number)[][] = []
    private values: BrickJsonResult = []
    result: BrickJsonResult = []
    json: AnyJson
    keyMap: Map<string, number> = new Map()
    indexMap: Map<number, string> = new Map()
    valuesSet: Set<BrickJsonBasic> = new Set()
    valuesMap: Map<BrickJsonBasic, number> = new Map()
    reduceValues: boolean | undefined

    constructor(json: AnyJson, options?: Partial<{ arrayIdentifier: string; reduceValues: boolean }>) {
        if (typeof json !== 'object' || json === null) {
            throw new Error('The params json is not a object')
        }
        this.json = json
        const { arrayIdentifier, reduceValues } = options || {}
        this.reduceValues = reduceValues
        arrayIdentifier && (this.arrayIdentifier = arrayIdentifier)
        this.result = this.getResult()
    }

    getResult() {
        const data = this.json
        this.values = Array.isArray(data) ? [...this.deepConvertArray(data)] : this.deepConvertObj(data as JsonMap)!

        if (this.reduceValues) {
            return [this.keys, Array.from(this.valuesSet), this.values]
        }
        return [this.keys, this.values]
    }

    deepConvertArray(jsonArray: JsonArray, isChild = true) {
        const res: BrickJsonResult = [isChild ? this.arrayIdentifier : ''].filter(Boolean)
        jsonArray.forEach(item => {
            const type = typeof item
            if (Array.isArray(item)) {
                res.push(this.deepConvertArray(item))
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
        const objKeys = Object.getOwnPropertyNames(obj).sort()
        const uniqueKey = objKeys.join()
        if (uniqueKey === '') {
            return res
        }
        let objValues = objKeys.map(key => {
            const val = obj[key]
            if (this.reduceValues) {
                if (typeof val !== 'object' || obj === null) {
                    const value = val as BrickJsonBasic
                    if (!this.valuesMap.has(value)) {
                        this.valuesMap.set(value, this.valuesSet.size)
                        this.valuesSet.add(value)
                    }
                    return this.valuesMap.get(value)!
                }
            }
            return val
        })

        if (this.keys.length) {
            const latestKey = this.getLastKeyInMap()
            for (const [key, index] of this.keyMap) {
                if (uniqueKey === key) {
                    const confirmIndex = this.keyMap.get(uniqueKey)!
                    res.unshift(confirmIndex)
                    break
                }

                const isRevert = uniqueKey.length < key.length
                const text = isRevert ? key : uniqueKey
                const sub = isRevert ? uniqueKey : key
                const nextIndex = this.keys.length

                // a part of keys matches
                if (~text.indexOf(sub)) {
                    let newKey: string
                    let otherPart: string[] = []
                    if (isRevert) {
                        newKey = sub
                        const index = this.saveKey(uniqueKey)
                        if (index === this.keys.length) {
                            this.keys.push(newKey.split(','))
                        }
                        const shouldCombineKeyIndex = this.getKeyIndexBy(text) as number
                        this.keys[shouldCombineKeyIndex] = [index, ...text.replace(newKey, '').split(',').filter(Boolean)]
                        res.unshift(index)
                    } else {
                        otherPart = text.replace(sub, '').split(',').filter(Boolean)
                        newKey = [index, ...otherPart].map(k => (typeof k === 'number' ? this.getKeyIndexBy(k) : k)).join()
                        objValues = newKey.split(',').map(key => {
                            const val = obj[key]
                            if (this.reduceValues) {
                                if (typeof val !== 'object' || obj === null) {
                                    const value = val as BrickJsonBasic
                                    return this.valuesMap.get(value)!
                                }
                            }
                            return val
                        })

                        this.saveKey(uniqueKey)
                        this.keys.push([index, ...otherPart])
                        res.unshift(nextIndex)
                    }
                    break
                } else if (latestKey === key) {
                    // None of keys matches
                    this.saveKey(uniqueKey)
                    this.keys.push([...objKeys])
                    res.unshift(nextIndex)
                    break
                }
            }
        } else {
            res.unshift(this.saveKey(uniqueKey))
            this.keys.push(objKeys)
        }

        res.push(...this.deepConvertArray(objValues, false))
        return res
    }

    getLastKeyInMap = () => {
        const map = this.keyMap
        return Array.from(map)[map.size - 1][0]
    }

    saveKey(key: string, index = this.keys.length) {
        if (this.getKeyIndexBy(key) !== undefined) {
            return this.keyMap.get(key)!
        } else {
            this.keyMap.set(key, index)
            this.indexMap.set(index, key)
        }
        return index
    }

    getKeyIndexBy(target: string | number) {
        return typeof target === 'number' ? this.indexMap.get(target) : this.keyMap.get(target)
    }
}
