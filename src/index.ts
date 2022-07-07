import { getData } from './data/getData';
import { logger } from './logger';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';

pipe(
	getData(),
	IOEither.map(() => {
		logger.info('Working so far');
		return null;
	})
)();
