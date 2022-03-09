import { createLogger, transports, format } from 'winston';
import * as Logger from '@craigmiller160/ts-functions/Logger';

const myFormat = format.printf(
	({ level, message, timestamp, stack }) =>
		`[${timestamp}] [${level}] - ${stack ?? message}`
);

const winstonLogger = createLogger({
	level: 'debug',
	levels: {
		error: 1,
		warn: 2,
		info: 3,
		debug: 4,
		verbose: 5
	},
	format: format.combine(
		format((info) => {
			info.level = info.level.toUpperCase();
			return info;
		})(),
		format.errors({
			stack: true
		}),
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss.SSS'
		}),
		format.colorize(),
		myFormat
	),
	transports: [new transports.Console()]
});

export const logger = Logger.createLogger(winstonLogger);
