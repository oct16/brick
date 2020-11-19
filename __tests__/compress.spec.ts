import { compress } from '../src'

describe('Test convert a json ', () => {
    test('Wrong params throw a error', () => {
        expect(() => compress(123)).toThrowError()
        expect(() => compress(null)).toThrowError()
        expect(() => compress(undefined)).toThrowError()
        expect(() => compress(true)).toThrowError()
        expect(() => compress(false)).toThrowError()
    })

    test('Result is a array', () => {
        expect(Array.isArray(compress([{}]))).toEqual(true)
        expect(Array.isArray(compress({}))).toEqual(true)
        expect(Array.isArray(compress([]))).toEqual(true)
    })

    test('Result length equal 2', () => {
        expect(compress({ a: 'a' }).length).toEqual(2)
        expect(compress([]).length).toEqual(2)
        expect(compress([{}, {}, {}]).length).toEqual(2)
        expect(compress([{ a: 'a' }]).length).toEqual(2)
    })
})

describe('Test the convert suite expected', () => {
    test('Convert object', () => {
        expect(
            // prettier-ignore
            compress({a:'a',b:'b'})
        ).toEqual([
            // prettier-ignore
            [['a', 'b']],
            // prettier-ignore
            [0, 'a', 'b']
        ])

        expect(
            // prettier-ignore
            compress({a:'a',b:'b',c:[1,2,3]})
        ).toEqual([
            // prettier-ignore
            [['a','b','c']],
            // prettier-ignore
            [0,'a','b',['$',1,2,3]]
        ])
    })

    test('Convert array', () => {
        expect(
            // prettier-ignore
            compress([1,2,3])
        ).toEqual([
            // prettier-ignore
            [],
            ['$', 1, 2, 3]
        ])
    })

    test('Convert normal json', () => {
        expect(
            // prettier-ignore
            compress([{a:'a',b:'b'}])
        ).toEqual([
            // prettier-ignore
            [['a', 'b']],
            // prettier-ignore
            ['$',[0, 'a', 'b']]
        ])
    })

    test('duplicate keys can merge', () => {
        expect(
            // prettier-ignore
            compress([
                { a: 'a', b: 'b' },
                { a: 'a', b: 'b', c: 'c' },
                { a: 'a', b: 'b', d: 'd' }
            ])
        ).toEqual([
            // prettier-ignore
            [['a', 'b'],[0, 'c'],[0, 'd']],
            // prettier-ignore
            ['$',[0, 'a', 'b'],[1, 'a', 'b', 'c'],[2, 'a', 'b', 'd']]
        ])
    })

    test('duplicate keys can merge by inverted', () => {
        expect(
            // prettier-ignore
            compress([{ a:'a',b:'b',c:'c'},{a:'a',b:'b'}])
        ).toEqual([
            // prettier-ignore
            [[1,'c'],[ 'a','b']],
            // prettier-ignore
            ['$',[0,'a','b','c'],[1,'a','b']]
        ])

        expect(
            // prettier-ignore
            compress([{ a:'a',b:'b',c:'c'},{a:'a',c:'c'},{ a:'a',b:'b'}])
        ).toEqual([
            // prettier-ignore
            [[2,'c'],['a','c'],['a','b']],
            ['$',[0,'a','b','c'],[1,'a','c'],[2,'a','b']]
            //prettier-ignore
        ])
    })

    test('json include sub array', () => {
        expect(
            // prettier-ignore
            compress([{ a:[1],b:[2],c:'c'}])
        ).toEqual([
            // prettier-ignore
            [['a','b', 'c']],
            ['$',[0,['$',1],['$',2],'c']]
            //prettier-ignore
        ])

        expect(
            // prettier-ignore
            compress([{ a:[1],b:[2],c:'c'},{a:'a',c:'c'},{ a:'a',b:'b'}])
        ).toEqual([
            // prettier-ignore
            [[2,'c'],['a','c'],['a','b']],
            ['$',[0,['$',1],['$',2],'c'],[1,'a','c'],[2,'a','b']]
            //prettier-ignore
        ])
    })

    test('json include sub object', () => {
        expect(
            // prettier-ignore
            compress([{ a:{},b:{},c: {}}])
        ).toEqual([
            // prettier-ignore
            [['a','b','c']],
            ['$', [0, [], [], []]]
        ])

        expect(
            // prettier-ignore
            compress([{ a:{ a:{},b:{},c: {}},b:{},c: {}}])
        ).toEqual([
            // prettier-ignore
            [['a','b','c']],
            ['$', [0, [0, [], [], []], [], []]]
        ])
    })

    test('json include mix array and object and base type', () => {
        expect(
            // prettier-ignore
            compress([{ a:{},b:{},c: {}}])
        ).toEqual([
            // prettier-ignore
            [['a','b','c']],
            ['$', [0, [], [], []]]
        ])

        expect(
            // prettier-ignore
            compress([{ a:[null, false, true, 123, '456'],b: {}}])
        ).toEqual([
            // prettier-ignore
            [['a','b']],
            ['$', [0, ['$', null, false, true, 123, '456'], []]]
        ])

        expect(
            // prettier-ignore
            compress([{ b:[[[[[[[[[[[]]]]]]]]]]],a: {}}])
        ).toEqual([
            // prettier-ignore
            [['a','b']],
            ['$', [0, [], ['$', ['$', ['$', ['$', ['$', ['$', ['$', ['$', ['$', ['$', ['$']]]]]]]]]]]]]
        ])

        expect(
            // prettier-ignore
            compress([
                {
                    b: [],
                    a: {}
                }
            ])
        ).toEqual([
            // prettier-ignore
            [['a','b']],
            ['$',[0, [], ['$']]]
            // prettier-ignore
        ])

        expect(
            // prettier-ignore
            compress([
                {
                    b: [],
                    a: {}
                },
                [],
                {
                    b: [],
                    a: {}
                }
            ])
        ).toEqual([
            // prettier-ignore
            [['a','b']],
            ['$',[0, [], ['$']], ['$'], [0, [], ['$']]]
            // prettier-ignore
        ])

        expect(
            // prettier-ignore
            compress([
                {
                    b: [],
                    a: {}
                },
                [],
                {
                    b: [],
                    a: {}
                },
                [{c: {d: {e: {}}}}]
            ])
        ).toEqual([
            // prettier-ignore
            [['a','b'],['c'], ['d'], ['e']],
            ['$',[0, [], ['$']], ['$'], [0, [], ['$']],['$', [1, [2, [3, []]]]]]
            // prettier-ignore
        ])

        expect(
            // prettier-ignore
            compress([
                [{c: {d: {e: {}}}}]
            ])
        ).toEqual([
            // prettier-ignore
            [['c'], ['d'], ['e']],
            ['$',['$', [0, [1, [2, []]]]]]
            // prettier-ignore
        ])

        expect(
            compress({
                a: [{ b: [{ c: [{ d: [{ e: { f: [false, [true, 123]] } }] }] }] }]
            })
        ).toEqual([
            // prettier-ignore
            [['a'], ['b'], ['c'], ['d'], ['e'], ['f']],
            [0, ['$', [1, ['$', [2, ['$', [3, ['$', [4, [5, ['$', false, ['$', true, 123]]]]]]]]]]]]
            // prettier-ignore
        ])
    })
})
