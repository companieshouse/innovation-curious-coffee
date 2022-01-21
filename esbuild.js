const esbuild = require('esbuild')
const {exec} = require('child_process')
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const outDir = './dist'

exec('./scripts/prebuild.sh', (err, stdout) => {
    console.log(stdout)
})

esbuild.build({
    entryPoints: ['./src/app.ts'],
    outfile: `${outDir}/app.js`,
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node14',
    plugins: [nodeExternalsPlugin()]
}).catch(err => {
    console.log(`ESbuild err: ${err}`)
    process.exit(1)
})

exec('./scripts/postbuild.sh', (err, stdout) => {
    console.log(stdout)
})