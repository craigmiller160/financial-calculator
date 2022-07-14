import { getData } from './data/getData';
import { logger } from './logger';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { createContext } from './context';
import { performCalculations } from './calculations';
import { writeDataFiles } from './output/writeDataFiles';
import { clearOutput } from './output/clearOutput';

pipe(
	clearOutput(),
	IOEither.chain(() => getData()),
	IOEither.map(createContext),
	IOEither.map(performCalculations),
	IOEither.chain(writeDataFiles),
	IOEither.fold(
		(ex) => () => {
			console.error(ex);
			return null;
		},
		() => () => {
			logger.info('Working so far');
			return null;
		}
	)
)();
