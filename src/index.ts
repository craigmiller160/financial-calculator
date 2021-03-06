import { getData } from './data';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { logger } from './logger';
import * as IO from 'fp-ts/IO';
import { runCalculations } from './calculations';
import { formatOutput } from './output/formatOutput';

pipe(
	getData(),
	IOEither.chain(runCalculations),
	IOEither.map(formatOutput),
	IOEither.fold(
		(ex) =>
			logger.errorWithStack(
				'Error performing financial calculations',
				ex
			),
		(output) =>
			pipe(
				logger.info('Successfully performed financial calculations'),
				IO.chain(() => logger.info(output))
			)
	)
)();
