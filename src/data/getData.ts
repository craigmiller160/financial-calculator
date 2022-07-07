import { IOT, IOTryT, TypeDecoder } from '@craigmiller160/ts-functions/types';
import * as File from '@craigmiller160/ts-functions/File';
import * as Process from '@craigmiller160/ts-functions/Process';
import path from 'path';
import * as IO from 'fp-ts/IO';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import * as Json from '@craigmiller160/ts-functions/Json';
import { logAndReturn } from '../logger';

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
		IOEither.map(logAndReturn('debug', `Successfully loaded ${filePath}`)),
		IOEither.chainEitherK(Json.parseE),
		IOEither.chainEitherK(decoder)
	);
