docker_compose("./docker-compose.yml")
docker_build('curious_coffee', '.',
  live_update = [
    sync('.', '/app'),
    run('npm i', trigger='package.json'),
    restart_container()
  ])