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

    test('Compress data from amap', async () => {
        const data = await fetch('https://ditu.amap.com/service/regeo?longitude=121.54474&latitude=31.308482').then(res => res.json())
        expect(decompress(compress(data))).toEqual(data)
    })

    test('Compress data from amap2', async () => {
        const data = await fetch('https://ditu.amap.com/service/regeo?longitude=121.14474&latitude=31.304').then(res => res.json())
        expect(decompress(compress(data))).toEqual(data)
    })

    test('Compress data from some any api', async () => {
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
            expect(decompress(compress(data))).toEqual(data)
        }
    })

    test('Compress really big data from timecatjs', async () => {
        const url = 'https://www.timecatjs.com/timeCatReplay/data.json'
        const data = await fetch(url).then(res => res.json())
        expect(decompress(compress(data))).toEqual(data)
    })
})
