import mongoose from 'mongoose';
import config from '../config';
import logger from '../logger';

export async function connect(): Promise<void> {
    logger.info("Connecting to MongoDB with details:");
    logger.info("Server: " + config.db.url.server);
    logger.info("Port: " + config.db.url.port);

    await mongoose.connect(config.db.url.server + config.db.url.port + "/" + config.db.name, {
        useNewUrlParser: true, 
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
}

mongoose.connection.on('error', function () {
    logger.error("Could not connect to MongoDB");
    process.exit();
})

mongoose.connection.on('connecting', function () {
    logger.info("Connecting to MongoDB...");
});

mongoose.connection.on('connected', function () {
    logger.info("Successfully connected to MongoDB instance");
});

mongoose.connection.once('open', function () {
    logger.info('MongoDB connection opened');
});