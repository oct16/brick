# Brick.Json
[![Coverage Status](https://coveralls.io/repos/github/oct16/brick/badge.svg)](https://coveralls.io/github/oct16/brick)
#### An algorithm for compress JSON, up to 15% better than Gzip

### Installation
```bash
$ npm install brick.json
# or
$ yarn add brick.json
```
### Usage
#### Basic
```ts
import { compress, decompress } from 'brick.json'

const data = [{a: 1, b: 2}, [1, 2, 3]]

const brickData = compress(data)

const res = decompress(brickData) // res is deep equal data

```

#### With Gzip
```ts
import { compressWithGzip, decompressWithGzip } from 'brick.json/gzip/cjs' // or esm

const data = [{a: 1, b: 2}, [1, 2, 3]]

const str = compressWithGzip(data) // type is string

const res = decompressWithGzip(str) // res is deep equal data

```
### Background

Sometimes our browser will upload some data to the server, but as the sender, the browser does not know which compression algorithms are supported by the service, so by default the uploaded data is not compressed, which is why this solution exists.
This lib used a cjson-like algorithms approach to de-weight duplicate keys to reduce the json size. As the compressed data resembles a lot of bricks 🧱🧱🧱, so it is named Brick.Json
### How it's work

A raw JSON object like below

```json
[
    {
        "a": "aa",
        "b": "bb",
        "c": "cc"
    },
    {
        "a": "2A",
        "b": {
            "b": "B",
            "c": "C",
            "d": [
                true,
                null,
                false
            ],
            "a": "A"
        }
    }
]
```
After **Brick.Json** compress

```js
[
    [[1,"c"],["a","b"],[0,"d"]], // keys array -> [ abc, ab, abcd ]
    ["$",[0,"aa","bb","cc"],[1,"2A",[2,"A","B","C",["$",true,null,false]]]] // values array
//    ↑                              ↑
//  start with $, is an array      start with number, is an object and will find the keys
]
```

#### Explanation

The first array holds the keys and the second array holds values
In the case of an object, the first value is a index of the key by which you can find the object's key, followed by the values
In the case of an array, the values of the array are ordered by an identifying a tag, followed by the values
 
### How it's compression rate and performance

##### Platform: MacBook Pro 2018 6C16G

```
┌───────────────────────┬────────────────────┬───────────────────┬──────────────────────┬──────────────────────┬─────────────────────┬───────────────────┐
│ Algorithm \ Data      │ Data1 (Object)     │ Data2 (Object)    │ Data3 (List1)        │ Data4 (List2)        │ Data5 (JueJin)      │ Data6 (Random)    │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ Raw                   │ 5842 100%          │ 3302 100%         │ 481714 100%          │ 972195 100%          │ 40949 100%          │ 2401 100%         │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ BrickJson             │ 5628 96.34% 0.2ms  │ 2455 74.35% 0.3ms │ 366456 76.07% 6.6ms  │ 738755 75.99% 11.4ms │ 19481 47.57% 1.1ms  │ 2350 97.88% 2.3ms │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ JSONH                 │ Not Support        │ Not Support       │ 469245 97.41% 1.2ms  │ 946826 97.39% 2.3ms  │ Not Support         │ Error             │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ JSONH With Gzip       │ Not Support        │ Not Support       │ 34161 7.09% 56.1ms   │ 68456 7.04% 33.6ms   │ Not Support         │ Error             │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ JSONH With Brotli     │ Not Support        │ Not Support       │ 18225 3.78% 1014.2ms │ 19009 1.96% 864.9ms  │ Not Support         │ Error             │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ Brotli                │ 1048 17.94% 18.9ms │ 825 24.98% 14.2ms │ 18392 3.82% 851.2ms  │ 19097 1.96% 882.5ms  │ 7436 18.16% 152.1ms │ 1023 42.61% 7.4ms │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ BrickJson With Brotli │ 1092 18.69% 17.2ms │ 837 25.35% 11.1ms │ 18140 3.77% 671.1ms  │ 18805 1.93% 686.2ms  │ 7119 17.39% 85.4ms  │ 1109 46.19% 7.6ms │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ Gzip                  │ 1245 21.31% 0.7ms  │ 1124 34.04% 1.3ms │ 35127 7.29% 41.0ms   │ 69507 7.15% 49.1ms   │ 11486 28.05% 8.9ms  │ 1169 48.69% 0.4ms │
├───────────────────────┼────────────────────┼───────────────────┼──────────────────────┼──────────────────────┼─────────────────────┼───────────────────┤
│ BrickJson With Gzip   │ 1279 21.89% 10.0ms │ 1103 33.40% 1.2ms │ 31518 6.54% 24.9ms   │ 62365 6.41% 43.3ms   │ 10467 25.56% 3.3ms  │ 1287 53.60% 4.5ms │
└───────────────────────┴────────────────────┴───────────────────┴──────────────────────┴──────────────────────┴─────────────────────┴───────────────────┘
BrkckJson compress: data1: 124 line x 15,105 ops/sec ±0.58% (85 runs sampled)
BrkckJson compress: data3: 10391 line x 250 ops/sec ±0.47% (82 runs sampled)
gzip      compress: data3: 10391 line x 56.43 ops/sec ±0.19% (70 runs sampled)
brotli    compress: data3: 10391 line x 1.17 ops/sec ±0.29% (7 runs sampled)
calcJSONH compress: data3: 10391 line x 6.69 ops/sec ±0.44% (21 runs sampled)
BrkckJson decompress: data1 x 22,616 ops/sec ±0.27% (92 runs sampled)
BrkckJson decompress: data3 x 645 ops/sec ±0.35% (90 runs sampled)
BrkckJson compressWithGzip: data1 x 2,113 ops/sec ±0.71% (91 runs sampled)
BrkckJson compressWithGzip: data3 x 59.69 ops/sec ±0.33% (60 runs sampled)
BrkckJson decompressWithGzip: data1 x 3,938 ops/sec ±0.49% (89 runs sampled)
BrkckJson decompressWithGzip: data3 x 54.18 ops/sec ±0.55% (68 runs sampled)
```

### Conclusion

1. Brotli has a high compression rate, but the performance is not very good, the compression speed is about 10 times slower than Gzip!

2. With Brotli and Gzip together, performance is similar, but compression ratios can be improved by around 10%!

3. Brick.Json is more compatible and more robust than JSONH

### recommendation

1. Transfer data from server to client, choose [Google Brotli](https://github.com/google/brotli)
2. Transfer data from client to server, choose Gzip or [Brick.Json](https://github.com/oct16/brick)

### Alternatives

- [jsonh](https://github.com/WebReflection/JSONH)
- [jsonc](https://github.com/tcorral/JSONC)
### Referrer

[Web Resource Optimization](http://web-resource-optimization.blogspot.com/2011/06/json-compression-algorithms.html)

### License

The code is licensed under the copyleft GPL-3.0. 
