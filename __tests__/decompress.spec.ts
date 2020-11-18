import { BrickJson } from '../src'

describe('Test convert BrickJson to Json ', () => {
    test('Wrong params throw a error', () => {
        expect(() => BrickJson.decompress('123' as any)).toThrowError()
        expect(() => BrickJson.decompress(123 as any)).toThrowError()
        expect(() => BrickJson.decompress(null as any)).toThrowError()
        expect(() => BrickJson.decompress(false as any)).toThrowError()
        expect(() => BrickJson.decompress({} as any)).toThrowError()
        expect(() => BrickJson.decompress([])).toThrowError()
        expect(() => BrickJson.decompress([[], [], []])).toThrowError()
    })
})

describe('Conversion and recovery', () => {
    test('Convert empty data', () => {
        const dataArray = [
            // prettier-ignore
            [[],[]]
        ]

        dataArray.forEach(data => {
            expect(BrickJson.decompress(BrickJson.compress(data))).toEqual(data)
        })
    })
    test('Convert object list', () => {
        const dataArray = [
            [{ a: 'a' }],
            [{ a: 'a', b: 'b' }],
            [
                { a: 'a', b: 'b' },
                { a: 'a', b: 'b' }
            ],
            [
                { a: 'a', b: 'b' },
                { a: 'a', b: 'b', c: 'c' },
                { a: 'a', d: 'd' }
            ]
        ]

        dataArray.forEach(data => {
            expect(BrickJson.decompress(BrickJson.compress(data))).toEqual(data)
        })
    })

    test('Convert object list include array', () => {
        const dataArray = [
            [{ a: [] }],
            [{ a: [], b: [], c: [] }],
            [{ a: [[], [], []], b: [[[[]]]], c: [[[]], [[]]] }],
            [[], [], []],
            [[[]], [[]], [[]]],
            // prettier-ignore
            [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] as any
        ]

        dataArray.forEach(data => {
            expect(BrickJson.decompress(BrickJson.compress(data))).toEqual(data)
        })
    })

    test('Convert object list include everything', () => {
        const dataArray = [
            // prettier-ignore
            {a: {b: {}}},
            [1, 2, 3],
            [false, true, false],
            [null, '', 123, false, true],
            [false, 123, [false, [{ a: null }], null], false],
            [{ a: { b: {} } }],
            [{ a: { b: { c: { d: {}, e: {}, f: { g: { h: { j: {} } } } } } } }]
        ]

        dataArray.forEach(data => {
            expect(BrickJson.decompress(BrickJson.compress(data))).toEqual(data)
        })
    })
})