<p align="center">
    <img src="readme-images/curious-coffee.png" alt="Curious Coffee" title="Curious Coffee" width="30%" />
</p>

![Build and test](https://github.com/drosser/innovation-curious-coffee/workflows/Build%20and%20test/badge.svg)

# #CuriousCoffee
Source code for the Curious Coffee initiative

## Table of content

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Config](#config)
  - [App](#app)
  - [DB](#db)
  - [Admin](#admin)
  - [Verify](#verify)
  - [Devmode](#devmode)
- [Deploying curious coffee](#deploy)

## Introduction
#CuriousCoffee is a initiative designed to break down silos within an organisation and match participants with people from different departments. Participants can register on the site and the system will ad-hoc match participants, as well as email them to inform them they've been matched and with who. It's then up to the matched participants to decide what to do next.

## Prerequisites
You will need the following:
- [npm](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [AWS-SES](https://aws.amazon.com/ses/) (Looking to remove this in later revisions to be less-dependant on specific non-required technologies)

## Config
Config is stored in the `env_vars` folder (in root) and needs to be sourced to run properly. Change the env vars to match whatever settings you need.

It is in the following format
```javascript
const config = {
    app: {
        port: APPLICATION_PORT
    },
    db: {z
        url: {
            server: "MONGO_SERVER",
            port: MONGO_PORT
        },
        name: "DB_NAME",
        collections: [
            "COLLECTION_1",
            "COLLECTION_2"
        ]    
    },
    admin: {
        password: "PASSWORD",
    },
    verify: {
        signature: "SIGNATURE",
        url: "URL_TO_VERIFY_ENDPOINT"
    },
    devmode: true
};

export = config;
```

The config can then be used as follows:

```javascript
//import the config module
import config from './config/config';

//access it as a normal object
const port = config.app.port;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
```

Each config item is as follows:

#### App
| Item | Type | Description | Example |
| ---- | ---- | ---- | ----|
| app.port | Integer | The port that the application is run on | `3000` |

#### DB
| Item | Type | Description | Example |
| ---- | ---- | ---- | ----|
| db.url.server | String | MongoDB server location | `"mongodb://localhost:"` |
| db.url.port | Integer | MongoDB port | `27017` |
| db.name | String | MongoDB db name | `"curious_coffee"` |
| db.collections | Array String | collections in the db | `["people", "feedback"]` |

#### Admin
| Item | Type | Description | Example |
| ---- | ---- | ---- | ----|
| admin.password | String | Password for that admin site | `"test"` |

#### Verify
| Item | Type | Description | Example |
| ---- | ---- | ---- | ----|
| verify.signature | String | Signature to be appended to email before being Base64 encoded to generate unique verify link | `"test"` |
| verify.url | String | Base URL to attach to verification email so user can verify their email | `"http://localhost:3000/verify"` |

#### Env
| Item | Type | Description | Example |
| ---- | ---- | ---- | ----|
| env | string | Used to determine what environment is being run (dev, test, prod, etc) | `"dev"` |


## Deploy
To deploy your own implementation of Curious Coffee:

```
git clone https://github.com/companieshouse/innovation-curious-coffee.git
```

Inside the directory: 

```
npm install
```

Build the contents: 

```
npm run build
```

And run the application:
```
npm run start
```

You'll need a MongoDB instance deployed somewhere with the config pointing at it, otherwise the app will fail on startup.