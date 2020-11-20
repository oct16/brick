import { decompress, compress } from '../src'

describe('Test convert to Json ', () => {
    test('Wrong params throw a error', () => {
        expect(() => decompress('123' as any)).toThrowError()
        expect(() => decompress(123 as any)).toThrowError()
        expect(() => decompress(null as any)).toThrowError()
        expect(() => decompress(false as any)).toThrowError()
        expect(() => decompress({} as any)).toThrowError()
        expect(() => decompress([])).toThrowError()
        expect(() => decompress([[], [], [], []])).toThrowError()
    })
})

describe('Conversion and recovery', () => {
    test('Convert empty data', () => {
        const dataArray = [
            // prettier-ignore
            [[],[]]
        ]

        dataArray.forEach(data => {
            expect(decompress(compress(data))).toEqual(data)
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
            expect(decompress(compress(data))).toEqual(data)
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
            expect(decompress(compress(data))).toEqual(data)
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
            expect(decompress(compress(data))).toEqual(data)
        })
    })
})

describe('Conversion and recovery with options', () => {
    test('set options arrayIdentifier', () => {
        // prettier-ignore
        const dataArray = [
            [[123], [1, 2, 3], { a: [1, 2, 3] }],
            [[123], [1, 2, 3], { a: [1, 2, 3], b: false, c: ['a','c'] }],
            {a: [1,2,3, [1,2,4]], c: [], d: [null]}
        ]

        dataArray.forEach(data => {
            expect(decompress(compress(data, { arrayIdentifier: '#' }), { arrayIdentifier: '#' })).toEqual(data)
        })
    })

    test('set options reduceValues', () => {
        const dataArray = [
            [[123], [1, 2, 3], { a: [1, 2, 3] }],
            [[123], [1, 2, 3], { a: [1, 2, 3], b: false, c: ['a', 'c'] }],
            { a: [1, 2, 3, [1, 2, 4]], c: [], d: [null] },
            { a: { b: {} } },
            [1, 2, 3],
            [false, true, false],
            [null, '', 123, false, true],
            [false, 123, [false, [{ a: null }], null], false],
            [{ a: { b: {} } }],
            [{ a: { b: { c: { d: {}, e: {}, f: { g: { h: { j: {} } } } } } } }]
        ]

        dataArray.forEach(data => {
            expect(decompress(compress(data, { arrayIdentifier: '#', reduceValues: true }), { arrayIdentifier: '#' })).toEqual(data)
        })
    })
})
