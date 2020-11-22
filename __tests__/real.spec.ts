import { compress, decompress } from '../src'
import data1 from '../benchmark/data/1.json'
import data2 from '../benchmark/data/2.json'
import data3 from '../benchmark/data/3.json'
import data4 from '../benchmark/data/4.json'
import data5 from '../benchmark/data/5.json'

describe('Test Really Json', () => {
    const dataList = [data1, data2, data3, data4, data5]
    test('test benchmark data', async () => {
        dataList.forEach((data, i) => {
            expect(decompress(compress(data))).toEqual(data)
            expect(decompress(compress(data))).toEqual(data)
        })
    })

    test('test benchmark data with options', async () => {
        dataList.forEach((data, i) => {
            expect(decompress(compress(data, { separatorIdentifier: '0' }))).toEqual(data)
            expect(decompress(compress(data))).toEqual(data)
        })

        dataList.forEach((data, i) => {
            expect(decompress(compress(data, { separatorIdentifier: '#' }))).toEqual(data)
            expect(decompress(compress(data))).toEqual(data)
        })

        dataList.forEach((data, i) => {
            expect(decompress(compress(data, { separatorIdentifier: '#', arrayIdentifier: '^' }))).toEqual(data)
            expect(decompress(compress(data))).toEqual(data)
        })
        dataList.forEach((data, i) => {
            expect(decompress(compress(data, { separatorIdentifier: '*', arrayIdentifier: '*' }))).toEqual(data)
            expect(decompress(compress(data))).toEqual(data)
        })
    })
})
