import * as File from '@craigmiller160/ts-functions/File';
import * as Process from '@craigmiller160/ts-functions/Process';
import { IOT, IOTryT } from '@craigmiller160/ts-functions/types';
import { Data, legalDataV, personalDataV } from './decoders';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import * as IO from 'fp-ts/IO';
import path from 'path';
import * as TypeValidation from '@craigmiller160/ts-functions/TypeValidation';
import { logger } from '../logger';
import * as Json from '@craigmiller160/ts-functions/Json';
import { TypeDecoder } from '@craigmiller160/ts-functions/types';

const decodePersonalData = TypeValidation.decode(personalDataV);
const decodeLegalData = TypeValidation.decode(legalDataV);

const getPersonalDataFilePath = (): IOT<string> =>
	pipe(
		Process.cwd(),
		IO.map((cwd) => path.join(cwd, 'data', 'personalData.json'))
	);

const getLegalDataFilePath = (): IOT<string> =>
	pipe(
		Process.cwd(),
		IO.map((cwd) => path.join(cwd, 'data', 'legalData.json'))
	);

const getDataFromFile = <T>(
	filePath: IOT<string>,
	decoder: TypeDecoder<T>
): IOTryT<T> =>
	pipe(
		filePath,
		IOEither.rightIO,
		IOEither.chain((filePath) => File.readFileSync(filePath)),
		IOEither.chainFirstIOK((content) => logger.debug(`Data: ${content}`)),
		IOEither.chainEitherK(Json.parseE),
		IOEither.chainEitherK(decoder)
	);

export const getData = (): IOTryT<Data> => {
	const logAndGetPersonalData = pipe(
		logger.info('Loading personal data'),
		IOEither.rightIO,
		IOEither.chain(() =>
			getDataFromFile(getPersonalDataFilePath(), decodePersonalData)
		)
	);
	const logAndGetLegalData = pipe(
		logger.info('Loading legal data'),
		IOEither.rightIO,
		IOEither.chain(() =>
			getDataFromFile(getLegalDataFilePath(), decodeLegalData)
		)
	);

	return pipe(
		logAndGetPersonalData,
		IOEither.bindTo('personalData'),
		IOEither.bind('legalData', () => logAndGetLegalData),
		IOEither.map(
			({ personalData, legalData }): Data => ({
				personalData,
				legalData
			})
		)
	);
};
