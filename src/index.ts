import { getData } from './data/getData';
import { logger } from './logger';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { createContext } from './context';
import { performCalculations } from './calculations';
import { writeDataFiles } from './output/writeDataFiles';

pipe(
	getData(),
	IOEither.map(createContext),
	IOEither.map(performCalculations),
	IOEither.chain(writeDataFiles),
	IOEither.map(() => {
		logger.info('Working so far');
		return null;
	})
)();
