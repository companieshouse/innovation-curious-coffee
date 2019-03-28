<p align="center">
    <img src="readme-images/curious-coffee.png" alt="Curious Coffee" title="Curious Coffee" width="30%" />
</p>

# #CuriousCoffee
Source code for the internal #CuriousCoffee initiative

## Table of content

- [Introduction](#introduction)
- [Config](#config)

## Introduction
#CuriousCoffee is a initiative designed to break down silos within Companies House and match participants with people from different departments. Participants can register on the site, and the system will ad-hoc match participants and email them to inform them they've been matched and with who. It's then up to the matched participants to decide what to do next.

## Config
Config is CAST5-ecrypted, and decoded is in the following format:
```javascript
const config = {
    app: {
        port: APPLICATION_PORT
    },
    db: {
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

module.exports = config;
```

The config can then be used as follows:

```javascript
//import the config module
const config = require('./config/config');

//access it as a normal object
const port = config.app.port;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
```

Each config item is as follows:

| Item | Type | Description | Example |
| ---- | ---- | ---- | ----|
| app.port | Integer | The port that the application is run on | `3000` |
| db.url.server | String | MongoDB server location | `"mongodb://localhost:"` |
| db.url.port | Integer | MongoDB port | `27017` |
| db.name | String | MongoDB db name | `"curious_coffee"` |
| db.collections | Array String | collections in the db | `["people", "feedback"]` |
| admin.password | String | Password for that admin site | `"test"` |
| verify.signature | String | Signature to be appended to email before being Base64 encoded to generate unique verify link | `"test"` |
| verify.url | String | Base URL to attach to verification email so user can verify their email | `"http://localhost:3000/verify"` |


