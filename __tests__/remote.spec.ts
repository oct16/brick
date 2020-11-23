import { compress, decompress } from '../src'
import fetch from 'node-fetch'

describe('Test convert to Json ', () => {
    test('Compress data from github api list-1', async () => {
        const list = [
            'https://api.github.com/repos/facebook/react',
            'https://api.github.com/repos/facebook/react/issues?state=open',
            'https://api.github.com/repos/facebook/react/pulls',
            'https://api.github.com/repos/facebook/react/git/trees/ebf158965f2b437515af0bed2b9e9af280e0ba3c',
            'https://api.github.com',
            'https://api.github.com/repos/facebook/react/stargazers',
            'https://api.github.com/users/octocat'
        ]
        for (let url of list) {
            const data = await fetch(url).then(res => res.json())
            expect(decompress(compress(data))).toEqual(data)
        }
    })

    test('Compress data from github api list-2', async () => {
        const list = [
            'https://api.github.com/orgs/github/events',
            'https://api.github.com/users/octocat/received_events',
            'https://api.github.com/users/octocat/subscriptions',
            'https://api.github.com/licenses',
            'https://api.github.com/repos/github/docs',
            'https://api.github.com/repos/github/docs/languages',
            'https://api.github.com/repos/github/docs/contributors',
            'https://api.github.com/repos/github/docs'
        ]
        for (let url of list) {
            const data = await fetch(url).then(res => res.json())
            expect(decompress(compress(data))).toEqual(data)
        }
    })

    test('Compress data from github api list-3', async () => {
        const list = [
            'https://api.github.com/repos/github/gitignore/pulls/3583',
            'https://api.github.com/repos/github/gitignore/pulls/3583/commits',
            'https://api.github.com/gists',
            'https://api.github.com/repos/github/gitignore/forks',
            'https://api.github.com/licenses/cc0-1.0',
            'https://api.github.com/emojis',
            'https://api.github.com/users/octocat/followers'
        ]

        for (let url of list) {
            const data = await fetch(url).then(res => res.json())
            expect(decompress(compress(data))).toEqual(data)
        }
    })

    test('Compress data from some any api', async () => {
        const list = [
            'https://ditu.amap.com/service/regeo?longitude=121.54474&latitude=31.308482',
            'https://ditu.amap.com/service/regeo?longitude=121.14474&latitude=31.304',
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
