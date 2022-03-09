import { getDataFromFile } from '../../src/data';
import { Data, legalDataV, personalDataV } from '../../src/data/decoders';
import { pipe } from 'fp-ts/function';
import path from 'path';
import { IOT, IOTryT } from '@craigmiller160/ts-functions/types';
import * as IOEither from 'fp-ts/IOEither';
import * as Process from '@craigmiller160/ts-functions/Process';
import * as IO from 'fp-ts/IO';
import * as TypeValidation from '@craigmiller160/ts-functions/TypeValidation';

const decodePersonalData = TypeValidation.decode(personalDataV);
const decodeLegalData = TypeValidation.decode(legalDataV);

const getTestPersonalDataPath = (): IOT<string> =>
	pipe(
		Process.cwd(),
		IO.map((cwd) =>
			path.join(cwd, 'test', '__test-data__', 'personalData.json')
		)
	);

const getTestLegalDataPath = (): IOT<string> =>
	pipe(
		Process.cwd(),
		IO.map((cwd) =>
			path.join(cwd, 'test', '__test-data__', 'legalData.json')
		)
	);

export const getTestData = (): IOTryT<Data> =>
	pipe(
		getDataFromFile(getTestPersonalDataPath(), decodePersonalData),
		IOEither.bindTo('personalData'),
		IOEither.bind('legalData', () =>
			getDataFromFile(getTestLegalDataPath(), decodeLegalData)
		),
		IOEither.map(
			({ personalData, legalData }): Data => ({
				personalData,
				legalData
			})
		)
	);
