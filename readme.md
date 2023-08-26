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

## Seeding
```bash
# must be in docker container.
$ docker exec -it $container_name sh
docker conatiner > $ npx ts-node ./src/database/seeders/seeder.ts
```

## Testing

```bash
# E2E tests
docker exec -it node_dev sh -c "npm run test:e2e"

# unit tests
docker exec -it node_dev sh -c "npm run test"

# test coverage
docker exec -it node_dev sh -c "npm run test:cov"
```