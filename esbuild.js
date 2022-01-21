const esbuild = require('esbuild')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { nodeExternalsPlugin } = require('esbuild-node-externals');


async function build() {
    const outDir = './dist'

    try {
        const {stdout} = await exec('./scripts/prebuild.sh')
        console.log(stdout)
    } catch (e) {
        console.log(`Recied exception when removing fist folder`)
    }

    const buildPromise = esbuild.build({
        entryPoints: ['./src/app.ts'],
        outfile: `${outDir}/app.js`,
        bundle: true,
        minify: true,
        platform: 'node',
        sourcemap: true,
        target: 'node14',
        plugins: [nodeExternalsPlugin()]
    })
    .then(() => console.log("Build complete"))
    .catch((err) => console.log(`Build failed: ${err}`))
    
    
    const transferStaticFilesPromise = exec('./scripts/postbuild.sh').then(({stdout}) => console.log(stdout))

    await Promise.allSettled([buildPromise, transferStaticFilesPromise])
}


build()