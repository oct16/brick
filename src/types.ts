export type AnyJson = boolean | number | string | null | undefined | JsonArray | JsonMap
export interface JsonMap {
    [key: string]: AnyJson
}
export type JsonArray = Array<AnyJson>

export type BrickJsonResult = Array<BrickJsonBasic | BrickJsonResult>
export type BrickJsonBasic = string | number | null | undefined
