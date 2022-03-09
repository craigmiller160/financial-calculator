import { getData } from './data';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { logger } from './logger';
import * as IO from 'fp-ts/IO';

pipe(
	getData(),
	IOEither.fold(
		(ex) => logger.errorWithStack('Error calculating 401k', ex),
		(output) =>
			pipe(
				logger.info('Successfully calculated 401k'),
				IO.chain(() => logger.info(output.toString()))
			)
	)
)();