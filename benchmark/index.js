var Benchmark = require('benchmark')
var suite = new Benchmark.Suite()
const { BrickJson } = require('../dist/brick.json.cjs')
const data1 = require('./data/1.zip.json')
const data2 = require('./data/2.zip.json')
const data3 = require('./data/3.zip.json')
const zippedData1 = require('./data/1.unzip.json')
const zippedData2 = require('./data/2.unzip.json')

const calcCompressionRate = (pre, cur) => ((100 * JSON.stringify(cur).length) / JSON.stringify(pre).length).toFixed(2) + '%'

console.log('Compression Rate:', 'data1', calcCompressionRate(data1, zippedData1))
console.log('Compression Rate:', 'data2', calcCompressionRate(data2, zippedData2))
console.log('Compression Rate:', 'data3', calcCompressionRate(data3, BrickJson.zip(data3)))

suite
    .add('BrkckJson zip: data1: 124 line', function () {
        BrickJson.zip(data1)
    })
    .add('BrkckJson zip: data2: 10411 line', function () {
        BrickJson.zip(data2)
    })
    .add('BrkckJson unzip: data1', function () {
        BrickJson.unzip(zippedData1)
    })
    .add('BrkckJson unzip: data2', function () {
        BrickJson.unzip(zippedData2)
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
