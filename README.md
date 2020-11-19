# Brick.json

##### A simple JSON compression algorithm that reduces the size of the data transfer.

### Background



### How it's work

A raw JSON object like below

```json
[   
  {
    "a": "aa",
    "b": "bb"
  },
  {
    "a": 11,
    "b": 22,
    "c": {
        "b": "B",
        "d": [true, null, false],
        "a": "A"
      }
  }
]
```
After **Brick.json** compress

```json
[
    [["a","b"],[0,"c"],[0,"d"]],
    ["$",[0,"aa","bb"],[1,11,22,[2,"A","B",["$",true,null,false]]]]
]
```
 
### How it's compression rate and performance

```
┌─────────────────────┬──────────────────┬─────────────────────┬───────────────┬───────────────┬────────────────┐
│ Algorithm \ Data    │ Data1 (A Object) │ Data2 (Random Json) │ Data3 (List1) │ Data4 (List2) │ Data5 (JueJin) │
├─────────────────────┼──────────────────┼─────────────────────┼───────────────┼───────────────┼────────────────┤
│ Raw                 │ 5842 100%        │ 2401 100%           │ 18995 100%    │ 486098 100%   │ 40949 100%     │
├─────────────────────┼──────────────────┼─────────────────────┼───────────────┼───────────────┼────────────────┤
│ JSONH               │ Not Support      │ Error               │ 13459 70.86%  │ 473629 97.43% │ Not Support    │
├─────────────────────┼──────────────────┼─────────────────────┼───────────────┼───────────────┼────────────────┤
│ BrickJson           │ 5628 96.34%      │ 2432 101.29%        │ 9292 48.92%   │ 370323 76.18% │ 19481 47.57%   │
├─────────────────────┼──────────────────┼─────────────────────┼───────────────┼───────────────┼────────────────┤
│ Gzip                │ 1245 21.31%      │ 1210 50.40%         │ 2164 11.39%   │ 35639 7.33%   │ 11486 28.05%   │
├─────────────────────┼──────────────────┼─────────────────────┼───────────────┼───────────────┼────────────────┤
│ JSONH With Gzip     │ Not Support      │ Error               │ 1972 10.38%   │ 35176 7.24%   │ Not Support    │
├─────────────────────┼──────────────────┼─────────────────────┼───────────────┼───────────────┼────────────────┤
│ BrickJson With Gzip │ 1279 21.89%      │ 1345 56.02%         │ 2079 10.94%   │ 32126 6.61%   │ 10467 25.56%   │
└─────────────────────┴──────────────────┴─────────────────────┴───────────────┴───────────────┴────────────────┘
BrkckJson compress: data1: 124 line x 32,630 ops/sec ±2.52% (81 runs sampled)
BrkckJson compress: data3: 10411 line x 2,275 ops/sec ±1.70% (83 runs sampled)
BrkckJson decompress: data1 x 38,535 ops/sec ±1.05% (88 runs sampled)
BrkckJson decompress: data3 x 3,816 ops/sec ±0.38% (89 runs sampled)
BrkckJson compressWithGzip: data1 x 2,081 ops/sec ±2.54% (76 runs sampled)
BrkckJson compressWithGzip: data3 x 997 ops/sec ±0.47% (89 runs sampled)
BrkckJson decompressWithGzip: data1 x 4,476 ops/sec ±0.51% (88 runs sampled)
BrkckJson decompressWithGzip: data3 x 1,488 ops/sec ±0.57% (86 runs sampled)
```

### Referrer

[Web Resource Optimization](http://web-resource-optimization.blogspot.com/2011/06/json-compression-algorithms.html)
