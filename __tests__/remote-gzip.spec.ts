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
        expect(decompressWithGzip(compressWithGzip(data))).toEqual(data)
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

    test('Compress data with gzip from some any api', async () => {
        const list = [
            'http://wthrcdn.etouch.cn/weather_mini?citykey=101010100',
            'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList&type=11&format=json',
            'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.artist.getList&format=xml&offset=0&limit=500&area=1&order=1&sex=3&abc=0',
            'http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=2.4.0&method=baidu.ting.plaza.getFocusPic&format=json&limit=1000',
            'https://zhuanlan.zhihu.com/api/columns/javascript',
            'https://zhuanlan.zhihu.com/api/columns/zhihuadmin',
            'https://www.v2ex.com/api/topics/hot.json',
            'https://www.v2ex.com/api/nodes/show.json?name=python',
            'https://www.v2ex.com/api/topics/latest.json'
        ]

        for (let url of list) {
            const data = await fetch(url).then(res => res.json())
            expect(decompressWithGzip(compressWithGzip(data))).toEqual(data)
        }
    })
})
