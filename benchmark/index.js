const Benchmark = require('benchmark')
const deepEqaul = require('deep-equal')
const brotli = require('brotli')
const pako = require('pako')
const jsonh = require('jsonh')
const chalk = require('chalk')
const table = require('cli-table2')
const suite = new Benchmark.Suite()
const { compress, decompress } = require('../dist/index.cjs')
const { compressWithGzip, decompressWithGzip } = require('../gzip/index.cjs')
const data1 = require('./data/1.json')
const data2 = require('./data/2.json')
const data3 = require('./data/3.json')
const data4 = require('./data/4.json')
const data5 = require('./data/5.json')
const data1Result = compress(data1)
const data3Result = compress(data3)

const data1WithGzipResult = compressWithGzip(data1)
const data3WithGzipResult = compressWithGzip(data3)

const hrTime = () => {
    const [s, ns] = process.hrtime()
    return s * 1e3 + ns * 1e-6
}

const checkData = (data, c, d) => {
    const compressed = c(data)
    if (deepEqaul(d(compressed), data)) {
        return true
    }
}
const jsonToArray = function (json) {
    const str = JSON.stringify(json, null, 0)
    const ret = new Uint8Array(str.length)
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i)
    }
    return ret
}

const calcCompression = data => {
    if (!checkData(data, compress, decompress)) {
        return chalk.red('Error')
    }
    const startTime = hrTime()
    const curLen = JSON.stringify(compress(data)).length
    const duration = ' ' + (hrTime() - startTime).toFixed(1) + 'ms'
    return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%' + duration
}

const calcJSONH = data => {
    try {
        const c = d => JSON.stringify(jsonh.pack(d))
        const d = c => jsonh.unpack(JSON.parse(c))
        if (!checkData(data, c, d)) {
            return chalk.red('Error')
        }
        const startTime = hrTime()
        const curLen = c(data).length
        const duration = ' ' + (hrTime() - startTime).toFixed(1) + 'ms'
        return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%' + duration
    } catch (err) {
        return chalk.yellow('Not Support')
    }
}

const calcJSONHWithGzip = data => {
    try {
        const c = d => pako.gzip(JSON.stringify(jsonh.pack(d)))
        const d = c => jsonh.unpack(JSON.parse(pako.ungzip(c, { to: 'string' })))
        if (!checkData(data, c, d)) {
            return chalk.red('Error')
        }
        const startTime = hrTime()
        const curLen = pako.gzip(JSON.stringify(jsonh.pack(data))).length
        const duration = ' ' + (hrTime() - startTime).toFixed(1) + 'ms'
        return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%' + duration
    } catch (err) {
        return chalk.yellow('Not Support')
    }
}
const calcJSONHWithBrotli = data => {
    try {
        const c = d => JSON.stringify(jsonh.pack(d))
        const d = c => jsonh.unpack(JSON.parse(c))
        if (!checkData(data, c, d)) {
            return chalk.red('Error')
        }

        const startTime = hrTime()
        const buf = jsonToArray(jsonh.pack(data))
        const curLen = brotli.compress(buf).length
        const duration = ' ' + (hrTime() - startTime).toFixed(1) + 'ms'
        return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%' + duration
    } catch (err) {
        return chalk.yellow('Not Support')
    }
}

const calcGZipped = data => {
    const startTime = hrTime()
    const curLen = pako.gzip(JSON.stringify(data)).length
    const duration = ' ' + (hrTime() - startTime).toFixed(1) + 'ms'
    return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%' + duration
}

const calcBrickJsonWithGZip = data => {
    const startTime = hrTime()
    const curLen = compressWithGzip(data).length
    const duration = ' ' + (hrTime() - startTime).toFixed(1) + 'ms'
    return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%' + duration
}

const calcWithBrotli = (json, c, options) => {
    let data = json
    if (typeof c === 'function') {
        json = c(data, options)
    }
    const startTime = hrTime()
    const buf = jsonToArray(json)
    const curLen = brotli.compress(buf).length
    const duration = ' ' + (hrTime() - startTime).toFixed(1) + 'ms'
    return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%' + duration
}

const calcRawData = data => {
    return JSON.stringify(data).length + ' 100%'
}

const getRandomArray = () => {
    let temp = new Array(100).fill('').map(() => Math.random().toString(36).slice(-8))
    let r = new Array(100).fill('').map(() => {
        const t = Math.floor(Math.random() * temp.length)
        const obj = {}
        temp[t].split(',').forEach(k => (obj[k] = Math.random().toString(36).slice(-8)))
        return obj
    })
    return JSON.parse(JSON.stringify(r))
}

const t = new table({
    head: ['Algorithm \\ Data', 'Data1 (Object)', 'Data2 (Object)', 'Data3 (List1)', 'Data4 (List2)', 'Data5 (JueJin)', 'Data6 (Random)'],
    style: { head: [] }
})

const list = [data1, data2, data3, data4, data5, getRandomArray()]
t.push(['Raw', ...list.map(calcRawData)])
t.push(['BrickJson', ...list.map(calcCompression)])
t.push(['JSONH', ...list.map(calcJSONH)])
t.push(['JSONH With Gzip', ...list.map(calcJSONHWithGzip)])
t.push(['JSONH With Brotli', ...list.map(calcJSONHWithBrotli)])
t.push(['Brotli', ...list.map(calcWithBrotli)])
t.push(['BrickJson With Brotli', ...list.map(data => calcWithBrotli(data, compress))])
t.push(['Gzip', ...list.map(calcGZipped)])
t.push(['BrickJson With Gzip', ...list.map(calcBrickJsonWithGZip)])
console.log(t.toString())

suite
    .add('BrkckJson compress: data1: 124 line', function () {
        compress(data1)
    })
    .add('BrkckJson compress: data3: 10391 line', function () {
        compress(data3)
    })
    .add('gzip    compress: data3: 10391 line', function () {
        calcGZipped(data3)
    })
    .add('brotli    compress: data3: 10391 line', function () {
        calcWithBrotli(data3)
    })
    .add('calcJSONH compress: data3: 10391 line', function () {
        calcJSONH(data3)
    })
    .add('BrkckJson decompress: data1', function () {
        decompress(data1Result)
    })
    .add('BrkckJson decompress: data3', function () {
        decompress(data3Result)
    })
    .add('BrkckJson compressWithGzip: data1', function () {
        compressWithGzip(data1)
    })
    .add('BrkckJson compressWithGzip: data3', function () {
        compressWithGzip(data3)
    })
    .add('BrkckJson decompressWithGzip: data1', function () {
        decompressWithGzip(data1WithGzipResult)
    })
    .add('BrkckJson decompressWithGzip: data3', function () {
        decompressWithGzip(data3WithGzipResult)
    })
    .on('cycle', function (event) {
        console.log(String(event.target))
    })
    .on('complete', function () {})
    .run({ async: true })
