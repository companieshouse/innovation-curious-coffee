const config = {
    app: {
        port: process.env.APP_PORT
    },
    db: {
        url: {
            server: process.env.DB_URL_SERVER,
            port: process.env.DB_URL_PORT
        },
        name: process.env.DB_NAME,
        collections: process.env.DB_COLLECTIONS
    },
    admin: {
        password: process.env.ADMIN_PASSWORD,
    },
    verify: {
        signature: process.env.VERIFY_SIGNATURE,
        url: process.env.VERIFY_URL
    },
    env: process.env.NODE_ENV
};

export default config;