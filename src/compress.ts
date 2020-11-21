import { AnyJson, BrickJsonBasic, BrickJsonResult, JsonArray, JsonMap } from './types'

export class BrickJsonCompress {
    private defaultOptions = { arrayIdentifier: '$', separatorIdentifier: ',' }
    private arrayIdentifier: string
    private separatorIdentifier: string
    private keys: (string | number)[][] = []
    private values: BrickJsonResult = []
    private json: AnyJson
    private keyMap: Map<string, number> = new Map()
    private indexMap: Map<number, string> = new Map()
    result: [{ si?: string; ai?: string }, BrickJsonResult, BrickJsonResult] | [BrickJsonResult, BrickJsonResult]

    constructor(json: AnyJson, options?: Partial<{ arrayIdentifier: string; separatorIdentifier: string }>) {
        if (typeof json !== 'object' || json === null) {
            throw new Error('The params json is not a object')
        }
        const { arrayIdentifier, separatorIdentifier } = options || {}
        this.json = json
        this.arrayIdentifier = arrayIdentifier || this.defaultOptions.arrayIdentifier
        this.separatorIdentifier = separatorIdentifier || this.defaultOptions.separatorIdentifier
        this.result = this.getResult()
    }

    getResult(): [{ si?: string; ai?: string }, BrickJsonResult, BrickJsonResult] | [BrickJsonResult, BrickJsonResult] {
        const data = this.json
        this.values = Array.isArray(data) ? [...this.deepConvertArray(data)] : this.deepConvertObj(data as JsonMap)!
        const opts = {
            ai: this.arrayIdentifier === this.defaultOptions.arrayIdentifier ? undefined : this.arrayIdentifier,
            si: this.separatorIdentifier === this.defaultOptions.separatorIdentifier ? undefined : this.separatorIdentifier
        }
        Object.keys(opts).forEach((k: keyof typeof opts) => {
            if (!opts[k]) {
                delete opts[k]
            }
        })
        if (Object.keys(opts).length) {
            return [opts, this.keys, this.values]
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
        const si = this.separatorIdentifier
        const res: BrickJsonResult = []
        const objKeys = Object.getOwnPropertyNames(obj).sort()
        const uniqueKey = objKeys.join(si)
        const holder = '<$index>'
        if (uniqueKey === '' && !objKeys.length) {
            return res
        }
        let objValues = objKeys.map(key => obj[key])
        if (this.keys.length) {
            const keyIndex = this.getIndexByKey(uniqueKey)
            if (keyIndex !== undefined) {
                objValues = uniqueKey.split(si).map(key => obj[key])
                res.push(keyIndex, ...this.deepConvertArray(objValues, false))
                return res
            }

            const latestKey = this.getLastKeyInMap()
            for (const [key, index] of this.keyMap) {
                const isRevert = uniqueKey.split(si).length < key.split(si).length
                const text = isRevert ? key : uniqueKey
                const sub = isRevert ? uniqueKey : key
                const nextIndex = this.keys.length

                // prettier-ignore
                const wrappedKeysStr = (s: string) => s.split(si).map(t => '<$' + t + '>').join(si)
                const wrappedText = wrappedKeysStr(text)
                const wrappedSub = wrappedKeysStr(sub)
                // a part of keys matches
                if (~wrappedText.indexOf(wrappedSub)) {
                    const newWrappedTextStr = wrappedText.replace(wrappedSub, holder)
                    const getNewKey = (idx: number) =>
                        newWrappedTextStr.split(si).map(k => {
                            return k === holder ? idx : k.substring(2, k.length - 1)
                        })
                    if (isRevert) {
                        const newKeyIndex = this.saveKey(sub)
                        const newKey = getNewKey(newKeyIndex)
                        const shouldCombineKeyIndex = this.getIndexByKey(text) as number
                        this.keys.push(sub.split(si))
                        this.keys[shouldCombineKeyIndex] = newKey
                        res.unshift(newKeyIndex)
                    } else {
                        const newKey = getNewKey(index)
                        this.saveKey(text)
                        this.keys.push(newKey)
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
        this.keyMap.set(key, index)
        this.indexMap.set(index, key)
        return index
    }

    getIndexByKey(key: string) {
        return this.keyMap.get(key)
    }
}
