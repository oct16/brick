import { compressWithGzip, decompressWithGzip } from '../src/gzip'
import fetch from 'node-fetch'

describe('Test convert to with gzip lib', () => {
    test('Compress with gzip simple data 1', async () => {
        const data = { a: { b: { c: {} } } }
        const compressed = compressWithGzip(data)
        expect(decompressWithGzip(compressed)).toEqual(data)
    })

    test('Compress with gzip simple data 2', async () => {
        const data = [1, null, false, '123', { a: 1, b: 2, array: [false, 2, 3] }, { a: 1, b: 2, array: [true, false, 2, 3] }]
        const compressed = compressWithGzip(data)
        expect(decompressWithGzip(compressed)).toEqual(data)
    })

    test('Compress with gzip data from github react open issues list', async () => {
        const data = await fetch('https://api.github.com/repos/facebook/react/issues?state=open').then(res => res.json())
        expect(decompressWithGzip(compressWithGzip(data))).toEqual(data)
    })

    test('Compress data from github react pull request list', async () => {
        const data = await fetch('https://api.github.com/repos/facebook/react/pulls').then(res => res.json())
        expect(decompressWithGzip(compressWithGzip(data))).toEqual(data)
    })
    test('Compress with gzip data from github react git trees', async () => {
        const data = await fetch(
            'https://api.github.com/repos/facebook/react/git/trees/ebf158965f2b437515af0bed2b9e9af280e0ba3c'
        ).then(res => res.json())
        expect(decompressWithGzip(compressWithGzip(data))).toEqual(data)
    })
    test('Compress with gzip data from github react git repo', async () => {
        const data = await fetch('https://api.github.com/repos/facebook/react').then(res => res.json())
        expect(decompressWithGzip(compressWithGzip(data))).toEqual(data)
    })
})
