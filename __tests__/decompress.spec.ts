import { decompress, compress } from '../src'

describe('Test convert to Json ', () => {
    test('Wrong params throw a error', () => {
        expect(() => decompress('123' as any)).toThrowError()
        expect(() => decompress(123 as any)).toThrowError()
        expect(() => decompress(null as any)).toThrowError()
        expect(() => decompress(false as any)).toThrowError()
        expect(() => decompress({} as any)).toThrowError()
        expect(() => decompress([] as any)).toThrowError()
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
            [{ a: { b: { c: { d: {}, e: {}, f: { g: { h: { j: {} } } } } } } }],
            [{ class: 'class' }, { class: 'class2' }]
        ]

        dataArray.forEach(data => {
            expect(decompress(compress(data))).toEqual(data)
        })
    })

    test('Some special data', () => {
        // prettier-ignore
        const dataArray = [
            {'': ','},
            {'': '',null: 'null'},
            {null: null, undefined: undefined },
            {true: true, false: false },
        ]

        dataArray.forEach(data => {
            expect(decompress(compress(data))).toEqual(data)
        })
    })

    test('Some special data keys include ","', () => {
        // prettier-ignore
        const dataArray = [
            {',': true, '': false , ',,,,': true, '.,': '', ',,,': '' },
            {',': ','}
        ]

        dataArray.forEach(data => {
            expect(decompress(compress(data, { separatorIdentifier: '|' }))).toEqual(data)
        })
    })
})
