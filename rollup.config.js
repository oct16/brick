import path from 'path'
import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'

const outputConfigs = path => [
    {
        file: `${path}.cjs.js`,
        format: `cjs`
    },
    {
        file: `${path}.esm.js`,
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
        ],
        sourcemap: true
    },
    {
        name: 'window',
        file: `${path}.global.js`,
        format: `iife`,
        extend: true,
        sourcemap: true
    }
]

const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production',
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
        compilerOptions: {
            module: 'ES2015'
        }
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
        output: outputConfigs('dist/index'),
        plugins: [tsPlugin, ...defaultPlugins]
    },
    {
        input: 'src/gzip/index.ts',
        output: outputConfigs('gzip/index'),
        plugins: [tsPlugin, ...defaultPlugins]
    },
    {
        input: 'src/gzip/index.ts',
        output: [
            { file: 'gzip/index.d.ts', format: 'es' },
            { file: 'gzip/index.esm.d.ts', format: 'es' },
            { file: 'gzip/index.cjs.d.ts', format: 'es' }
        ],
        plugins: [dts()]
    }
]
