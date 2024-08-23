<p align="center">
    <img src="readme-images/curious-coffee.png" alt="Curious Coffee" title="Curious Coffee" width="30%" />
</p>

![Build and test](https://github.com/companieshouse/innovation-curious-coffee/workflows/Build%20and%20test/badge.svg)

# #CuriousCoffee

[Source code for the Curious Coffee initiative](https://github.com/companieshouse/innovation-curious-coffee.git)

## Table of content

- [#CuriousCoffee](#curiouscoffee)
  - [Table of content](#table-of-content)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Database](#database)
  - [Notify](#notify)
  - [Config](#config)
  - [Deploy](#deploy)
  - [Deploy with Docker](#deploy-with-docker)
  - [Development testing with Docker](#development-testing-with-docker)
  - [Use within Companies House](#use-within-companies-house)

## Introduction

CuriousCoffee is a initiative designed to break down silos within an organisation and match participants with people from different departments. Participants can register on the site and the system will ad-hoc match participants, as well as email them to inform them they've been matched and with who. It's then up to the matched participants to decide what to do next.

It is written in TypeScript, and by default uses MongoDB as it's data store and AWS-SES as it's notifier.

## Prerequisites

You will need the following:
- [npm](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/) (See below for more details)
- [AWS-SES](https://aws.amazon.com/ses/) (See below for more details)

## Database

By default, Curious Coffee uses MongoDB via [MongooseJS](https://mongoosejs.com/). An attempt has been made to make this as generic as possible (see the `src/database` module), but the models themselves need to be bound in a certain way via Mongoose. This makes it a bit harder to swap out, but the models aren't complicated so it shouldn't be much work.

## Notify

By default, Curious Coffee notifies participants three times - during registration, when they have verified, and when they have been matched. The default implementation of this uses AWS-SES (see the `src/notify` module). This can be swapped out for another provider easily enough as the notify module has been built so that the user simply needs to configure the from, to, subject and body of the email before calling `notify(params)`. This can also be extended to use other types of notifications by adding an interface for the new type of communication (for example, `SMS`) and then adding an object of that interface to the `Params` interface.

## Config

Config is stored in the `env_vars` folder (in root) and needs to be sourced to run properly. Change the env vars to match whatever settings you need.

The config can then be used as follows:

```javascript
//import the config module
import config from './config';

//access it as a normal object
const port = config.app.port;

//start the listener
app.listen(port, () => {
    console.log('Listening on port ' + port);
});
```

The environment variables needed are below.

| Item | Type | Description | Example |
| ---- | ---- | ---- | ----|
| APP_PORT | Integer | The port that the application is run on | `3000` |
| DB_URL_SERVER | String | MongoDB server location | `"mongodb://localhost:"` |
| DB_URL_PORT | Integer | MongoDB port | `27017` |
| DB_NAME | String | MongoDB db name | `"curious_coffee"` |
| ADMIN_PASSWORD | String | Password for that admin site | `"test"` |
| VERIFY_SIGNATURE | String | Signature to be appended to email before being Base64 encoded to generate unique verify link | `"test"` |
| VERIFY_URL | String | Base URL to attach to verification email so user can verify their email | `"http://localhost:3000/verify"` |
| NODE_ENV | string | Used to determine what environment is being run (dev, test, prod, etc) | `"dev"` |
| AWS_REGION | string | Used to determine which AWS region to use | `"eu-west-1"` |

## Deploy

To deploy your own implementation of Curious Coffee:

```
git clone https://github.com/companieshouse/innovation-curious-coffee.git
```

Inside the directory:

``` bash
npm install
```

Build the contents and run:

``` bash
./run.sh
```

## Deploy with Docker

Note: **Not currently used**

To build the docker image, use the production docker file located at `docker/Dockerfile`.

To build the docker image run the following command in the root of the repository:

``` bash
docker build -t curious-coffee -f docker/Dockerfile . 
```

To run the image as a container:

``` bash
source env_vars
docker run --rm --it --env-file <(env) curious-coffee 
```

## Development testing with Docker

[Docker compose](https://docs.docker.com/compose/) and [Tilt](https://tilt.dev/) are used to provide a mongo database instance as well as live reloading during development.

First ensure both tools have been installed.
Log in to docker eu-west-1
Then in the root of the repository run:

``` bash
tilt up
```

This will start tilt, which in turn will start mongo, and an instance of [curious coffee](http://localhost:3000/).

Anytime a file in src or views is changed, the new files will be copied into the container, and the app will restart.

## Use within Companies House

See pages on [Companies House Confluence](https://companieshouse.atlassian.net/wiki/spaces/DEV/pages/778338309/CuriousCoffee)
