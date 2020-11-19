var Benchmark = require('benchmark')
var pako = require('pako')
var suite = new Benchmark.Suite()
const { compress, decompress } = require('../dist/index.cjs')
const { compressWithGzip, decompressWithGzip } = require('../gzip/index.cjs')
const data1 = require('./data/1.json')
const data2 = require('./data/2.json')
const data3 = require('./data/3.json')
const data1Result = compress(data1)
const data2Result = compress(data2)
const data3Result = compress(data3)

const data1WithGzipResult = compressWithGzip(data1)
const data2WithGzipResult = compressWithGzip(data2)

const calcCompressionRate = (pre, cur) => ((100 * JSON.stringify(cur).length) / JSON.stringify(pre).length).toFixed(2) + '%'

console.log('BrkckJson Compression Rate:', 'data1', calcCompressionRate(data1, data1Result))
console.log('BrkckJson Compression Rate:', 'data2', calcCompressionRate(data2, data2Result))
console.log('BrkckJson Compression Rate:', 'data3', calcCompressionRate(data3, data3Result))

console.log('Gzip Compression Rate:', 'data1', calcCompressionRate(data1, pako.gzip(JSON.stringify(data1))))
console.log('Gzip Compression Rate:', 'data2', calcCompressionRate(data2, pako.gzip(JSON.stringify(data2))))
console.log('Gzip Compression Rate:', 'data3', calcCompressionRate(data3, pako.gzip(JSON.stringify(data3))))

console.log('BrkckJson Compression With Gzip Rate:', 'data1', calcCompressionRate(data1, compressWithGzip(data1)))
console.log('BrkckJson Compression With Gzip Rate:', 'data2', calcCompressionRate(data2, compressWithGzip(data2)))
console.log('BrkckJson Compression With Gzip Rate:', 'data3', calcCompressionRate(data3, compressWithGzip(data3)))

suite
    .add('BrkckJson compress: data1: 124 line', function () {
        compress(data1)
    })
    .add('BrkckJson compress: data2: 10411 line', function () {
        compress(data2)
    })
    .add('BrkckJson decompress: data1', function () {
        decompress(data1Result)
    })
    .add('BrkckJson decompress: data2', function () {
        decompress(data2Result)
    })
    .add('BrkckJson decompressWithGzip: data1', function () {
        decompressWithGzip(data1WithGzipResult)
    })
    .add('BrkckJson decompressWithGzip: data2', function () {
        decompressWithGzip(data2WithGzipResult)
    })
    // add listeners
    .on('cycle', function (event) {
        console.log(String(event.target))
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'))
    })
    // run async
    .run({ async: true })
