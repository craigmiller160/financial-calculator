import { createLogger, format, transports } from 'winston';

const myFormat = format.printf(
	({ level, message, timestamp, stack }) =>
		`[${timestamp}] [${level}] - ${stack ?? message}`
);

export const logger = createLogger({
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

export type LoggerMethod = 'debug' | 'info' | 'error' | 'warning';

export const logAndReturn =
	(level: LoggerMethod, message: string) =>
	<T>(value: T): T => {
		logger[level](message);
		return value;
	};
