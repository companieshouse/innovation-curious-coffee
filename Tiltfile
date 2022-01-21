local_resource(
  name = 'Build JS',
  cmd = 'npm run-script build-quick',
  deps = ['src']
)

docker_compose("./docker-compose.yml")

docker_build('curious_coffee', '.',
  live_update = [
    sync('.', '/app'),
    run('npm i', trigger='package.json'),
    restart_container()
  ])