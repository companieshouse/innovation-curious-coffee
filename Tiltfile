docker_compose("./docker/docker-compose.yml")

custom_build(
    'curious_coffee',
    'DOCKER_BUILDKIT=0 docker build --tag $EXPECTED_REF . -f ./docker/Dockerfile.dev',
    live_update = [
        sync(local_path = './src', remote_path = '/app/src'),
        run('npm install', trigger=['./package.json', './package-lock.json'])
    ],
    deps = [
        './src',
        './views'
    ]   
)

