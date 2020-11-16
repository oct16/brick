const execa = require('execa')
const env = 'production'
async function run() {
    execa('rollup', ['-c', '--environment', `NODE_ENV:${env}`], {
        stdio: 'inherit'
    })
}

run()
