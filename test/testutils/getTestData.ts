import { IOT, IOTryT } from '@craigmiller160/ts-functions/types';
import { pipe } from 'fp-ts/function';
import * as Process from '@craigmiller160/ts-functions/Process';
import * as IO from 'fp-ts/IO';
import path from 'path';
import * as IOEither from 'fp-ts/IOEither';
import {
	Data,
	decodeLegalData,
	decodePersonalData,
	getDataFromFile
} from '../../src/data/getData';

const getPersonalDataFilePath = (): IOT<string> =>
	pipe(
		Process.cwd(),
		IO.map((cwd) =>
			path.join(cwd, 'test', '__testData__', 'personalData.json')
		)
	);

const getLegalDataFilePath = (): IOT<string> =>
	pipe(
		Process.cwd(),
		IO.map((cwd) =>
			path.join(cwd, 'test', '__testData__', 'legalData.json')
		)
	);

export const getTestData = (): IOTryT<Data> => {
	const getPersonalData = pipe(
		getPersonalDataFilePath(),
		IOEither.rightIO,
		IOEither.chain((path) => getDataFromFile(path, decodePersonalData))
	);

	const getLegalData = pipe(
		getLegalDataFilePath(),
		IOEither.rightIO,
		IOEither.chain((path) => getDataFromFile(path, decodeLegalData))
	);

	return pipe(
		getPersonalData,
		IOEither.bindTo('personalData'),
		IOEither.bind('legalData', () => getLegalData),
		IOEither.map(
			({ personalData, legalData }): Data => [personalData, legalData]
		)
	);
};
