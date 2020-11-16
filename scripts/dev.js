const execa = require('execa')
const env = 'development'
async function run() {
    execa('rollup', ['-wc', '--environment', `NODE_ENV:${env}`], {
        stdio: 'inherit'
    })
}

run()
