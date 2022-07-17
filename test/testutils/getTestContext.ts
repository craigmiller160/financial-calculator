import { IOTryT } from '@craigmiller160/ts-functions/types';
import { BaseContext, createContext } from '../../src/context';
import { pipe } from 'fp-ts/function';
import { getTestData } from './getTestData';
import * as IOEither from 'fp-ts/IOEither';

export const getTestBaseContext = (): IOTryT<BaseContext> =>
	pipe(getTestData(), IOEither.map(createContext));
