import { IOT, IOTryT, TypeDecoder } from '@craigmiller160/ts-functions/types';
import * as File from '@craigmiller160/ts-functions/File';
import * as Process from '@craigmiller160/ts-functions/Process';
import path from 'path';
import * as IO from 'fp-ts/IO';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import * as Json from '@craigmiller160/ts-functions/Json';
import { logAndReturn, logger } from '../logger';
import { PersonalData, personalDataCodec } from './decoders/personalData';
import { LegalData, legalDataCodec } from './decoders/legalData';
import * as TypeValidation from '@craigmiller160/ts-functions/TypeValidation';

const decodePersonalData = TypeValidation.decode(personalDataCodec);
const decodeLegalData = TypeValidation.decode(legalDataCodec);

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
	filePath: string,
	decoder: TypeDecoder<T>
): IOTryT<T> =>
	pipe(
		File.readFileSync(filePath),
		IOEither.map(logAndReturn('info', `Successfully loaded ${filePath}`)),
		IOEither.chainEitherK(Json.parseE),
		IOEither.chainEitherK(decoder)
	);

export type Data = [PersonalData, LegalData];

export const getData = (): IOTryT<Data> => {
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
		IOEither.rightIO(() => logger.debug('Loading personal data')),
		IOEither.chain(() => getPersonalData),
		IOEither.bindTo('personalData'),
		IOEither.map(logAndReturn('debug', 'Loading legal data')),
		IOEither.bind('legalData', () => getLegalData),
		IOEither.map(({ personalData, legalData }) => [personalData, legalData])
	);
};
