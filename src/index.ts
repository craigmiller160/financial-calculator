import { getData } from './data/getData';
import { logger } from './logger';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { createContext } from './context';
import { performCalculations } from './calculations';
import { writeDataFiles } from './output/writeDataFiles';
import { resetOutput } from './output/resetOutput';

pipe(
	resetOutput(),
	IOEither.chain(() => getData()),
	IOEither.map(createContext),
	IOEither.chainEitherK(performCalculations),
	IOEither.chain(writeDataFiles),
	IOEither.fold(
		(ex) => () => {
			console.error(ex);
			return null;
		},
		(context) => () => {
			logger.info(`Working so far. 401k Rate: ${context.future401kRate}`);
			return null;
		}
	)
)();
