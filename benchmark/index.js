const Benchmark = require('benchmark')
const deepEqaul = require('deep-equal')
const pako = require('pako')
const jsonh = require('jsonh')
const Table = require('cli-table2')
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

const checkData = (data, c, d) => {
    const compressed = c(data)
    if (deepEqaul(d(compressed), data)) {
        return true
    }
}

const calcCompressionRate = data => {
    if (!checkData(data, compress, decompress)) {
        return 'Error'
    }
    const curLen = JSON.stringify(compress(data)).length
    return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%'
}

const calcJSONHRate = data => {
    try {
        const c = d => JSON.stringify(jsonh.pack(d))
        const d = c => jsonh.unpack(JSON.parse(c))
        if (!checkData(data, c, d)) {
            return 'Error'
        }

        const curLen = c(data).length
        return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%'
    } catch (err) {
        return 'Not Support'
    }
}

const calcJSONHRateWithGzip = data => {
    try {
        const c = d => pako.gzip(JSON.stringify(jsonh.pack(d)))
        const d = c => jsonh.unpack(JSON.parse(pako.ungzip(c, { to: 'string' })))
        if (!checkData(data, c, d)) {
            return 'Error'
        }

        const curLen = pako.gzip(JSON.stringify(jsonh.pack(data))).length
        return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%'
    } catch (err) {
        return 'Not Support'
    }
}

const calcGZippedRate = data => {
    const curLen = pako.gzip(JSON.stringify(data)).length
    return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%'
}

const calcBrickJsonWithGZippedRate = data => {
    const curLen = compressWithGzip(data).length
    return curLen + ' ' + (100 * (curLen / JSON.stringify(data).length)).toFixed(2) + '%'
}

const calcRawData = data => {
    return JSON.stringify(data).length + ' 100%'
}

const table = new Table({
    head: ['Algorithm \\ Data', 'Data1 (A Object)', 'Data2 (Random Json)', 'Data3 (List1)', 'Data4 (List2)', 'Data5 (JueJin)'],
    style: { head: [] }
})

const list = [data1, data2, data3, data4, data5]
table.push(['Raw', ...list.map(calcRawData)])
table.push(['JSONH', ...list.map(calcJSONHRate)])
table.push(['BrickJson', ...list.map(calcCompressionRate)])
table.push(['Gzip', ...list.map(calcGZippedRate)])
table.push(['JSONH With Gzip', ...list.map(calcJSONHRateWithGzip)])
table.push(['BrickJson With Gzip', ...list.map(calcBrickJsonWithGZippedRate)])
console.log(table.toString())

suite
    .add('BrkckJson compress: data1: 124 line', function () {
        compress(data1)
    })
    .add('BrkckJson compress: data3: 10411 line', function () {
        compress(data3)
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
