import winston from 'winston';

class LoggerFactory {

    static create(): winston.Logger {

        const colorizer = winston.format.colorize();

        return winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.printf(({ level, message, timestamp }) => {
                            return colorizer.colorize(level, `${timestamp} ${level}: ${message}`);
                        })
                    )
                })
            ]
        });

    }
}

export = LoggerFactory;
