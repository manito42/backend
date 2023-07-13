## Description

42 manito backend repo

## Installation

```bash
$ npm install
```

## Running the app in development environment
first, set the env file. see env_sample file

```bash
# first, install npm packages
$ npm install
# run docker
$ docker compose up -d
# set prisma client in docker container!!
$ docker exec -it $container_name sh
docker conatiner > $ npx prisma generate
```