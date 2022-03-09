import * as File from '@craigmiller160/ts-functions/File';
import * as Process from '@craigmiller160/ts-functions/Process';
import { IOT, IOTryT } from '@craigmiller160/ts-functions/types';
import { Data, dataV } from './decoders';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import * as IO from 'fp-ts/IO';
import path from 'path';
import * as TypeValidation from '@craigmiller160/ts-functions/TypeValidation';

const decodeData = TypeValidation.decode(dataV);

const getDataFilePath = (): IOT<string> =>
	pipe(
		Process.cwd(),
		IO.map((cwd) => path.join(cwd, 'data', 'data.json'))
	);

export const getData = (): IOTryT<Data> =>
	pipe(
		getDataFilePath(),
		IOEither.rightIO,
		IOEither.chain((filePath) => File.readFileSync(filePath)),
		IOEither.chainEitherK(decodeData)
	);
