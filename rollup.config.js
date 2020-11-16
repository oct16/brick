import path from 'path'
import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const name = 'brick.json'
const outputConfigs = [
    {
        file: `dist/${name}.cjs.js`,
        format: `cjs`
    },
    {
        file: `dist/${name}.esm.js`,
        format: `es`,
        plugins: [
            terser({
                module: true,
                compress: {
                    ecma: 2015,
                    pure_getters: true
                },
                output: { comments: false }
            })
        ]
    },
    {
        name: 'window',
        file: `dist/${name}.global.js`,
        format: `iife`,
        extend: true
    }
]

const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production',
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
        exclude: ['**/test']
    }
})

const defaultPlugins = [
    node({
        browser: true,
        mainFields: ['module', 'main']
    }),
    commonjs({
        include: /node_modules/
    })
]

export default [
    {
        input: 'src/index.ts',
        output: outputConfigs,
        plugins: [tsPlugin, ...defaultPlugins]
    }
]
