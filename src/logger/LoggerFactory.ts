import config from '../config'
import winston from 'winston';

class LoggerFactory {

    static create(): winston.Logger {

        const colorizer = winston.format.colorize();

        return winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: config.logging.level,
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