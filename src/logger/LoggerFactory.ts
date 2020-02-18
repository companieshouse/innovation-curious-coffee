import winston from 'winston';

class LoggerFactory {

    static create(): winston.Logger {

        return winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize()
                    )
                })
            ]
        });

    }
}

export = LoggerFactory;