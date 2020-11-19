import { compress, decompress } from '../src'
import fetch from 'node-fetch'

describe('Test convert to Json ', () => {
    test('Compress data from github react open issues list', async () => {
        const data = await fetch('https://api.github.com/repos/facebook/react/issues?state=open').then(res => res.json())
        expect(decompress(compress(data))).toEqual(data)
    })

    test('Compress data from github react pull request list', async () => {
        const data = await fetch('https://api.github.com/repos/facebook/react/pulls').then(res => res.json())
        expect(decompress(compress(data))).toEqual(data)
    })
    test('Compress data from github react git trees', async () => {
        const data = await fetch(
            'https://api.github.com/repos/facebook/react/git/trees/ebf158965f2b437515af0bed2b9e9af280e0ba3c'
        ).then(res => res.json())
        expect(decompress(compress(data))).toEqual(data)
    })
    test('Compress data from github react git repo', async () => {
        const data = await fetch('https://api.github.com/repos/facebook/react').then(res => res.json())
        expect(decompress(compress(data))).toEqual(data)
    })
})
