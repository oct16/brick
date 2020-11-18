import { AnyJson, BrickJsonBasic, BrickJsonResult, JsonArray, JsonMap } from './types'

export class BrickJsonZip {
    private arrayIdentifier = '$'
    private keys: (string | number)[][] = []
    private values: BrickJsonResult = []
    result: BrickJsonResult = []
    json: AnyJson
    private keyMap: Map<string, number> = new Map()
    private indexMap: Map<number, string> = new Map()

    constructor(json: AnyJson, arrayIdentifier?: string) {
        if (typeof json !== 'object' || json === null) {
            throw new Error('The params json is not a object')
        }
        this.json = json
        arrayIdentifier && (this.arrayIdentifier = arrayIdentifier)
        this.result = this.getResult()
    }

    getResult() {
        const data = this.json
        this.values = Array.isArray(data) ? [...this.deepConvertArray(data)] : this.deepConvertObj(data as JsonMap)!
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
        let objValues = objKeys.map(key => obj[key])
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
                        debugger
                        newKey = sub
                        const index = this.keys.length
                        this.saveKey(uniqueKey)
                        this.keys.push(newKey.split(','))
                        const shouldCombineKeyIndex = this.getBy(text) as number
                        this.keys[shouldCombineKeyIndex] = [index, ...text.replace(newKey, '').split(',').filter(Boolean)]
                        res.unshift(index)
                    } else {
                        otherPart = text.replace(sub, '').split(',').filter(Boolean)
                        newKey = [index, ...otherPart].map(k => (typeof k === 'number' ? this.getBy(k) : k)).join()
                        objValues = newKey.split(',').map(key => obj[key])
                        const isKeyExist = this.getBy(newKey) !== undefined
                        if (!isKeyExist) {
                            this.saveKey(uniqueKey)
                            this.keys.push([index, ...otherPart])
                            res.unshift(nextIndex)
                        }
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
        !this.keyMap.has(key) && this.keyMap.set(key, index)
        !this.indexMap.has(index) && this.indexMap.set(index, key)
        return index
    }

    getBy(target: string | number) {
        return typeof target === 'number' ? this.indexMap.get(target) : this.keyMap.get(target)
    }
}
