var Benchmark = require('benchmark')
var suite = new Benchmark.Suite()
const { BrickJson } = require('../dist/brick.json.cjs')
const data1 = require('./data/1.json')
const data2 = require('./data/2.json')
const data3 = require('./data/3.json')
const data1Result = BrickJson.compress(data1)
const data2Result = BrickJson.compress(data2)
const data3Result = BrickJson.compress(data3)

const calcCompressionRate = (pre, cur) => ((100 * JSON.stringify(cur).length) / JSON.stringify(pre).length).toFixed(2) + '%'

console.log('Compression Rate:', 'data1', calcCompressionRate(data1, data1Result))
console.log('Compression Rate:', 'data2', calcCompressionRate(data2, data2Result))
console.log('Compression Rate:', 'data3', calcCompressionRate(data3, data3Result))

suite
    .add('BrkckJson compress: data1: 124 line', function () {
        BrickJson.compress(data1)
    })
    .add('BrkckJson compress: data2: 10411 line', function () {
        BrickJson.compress(data2)
    })
    .add('BrkckJson decompress: data1', function () {
        BrickJson.decompress(data1Result)
    })
    .add('BrkckJson decompress: data2', function () {
        BrickJson.decompress(data2Result)
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
