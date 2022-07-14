import { IOTryT } from '@craigmiller160/ts-functions/types';
import * as Process from '@craigmiller160/ts-functions/Process';
import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import { createOutputPath } from './constants';
import * as IOEither from 'fp-ts/IOEither';
import * as File from '@craigmiller160/ts-functions/File';

const rmOutputDirectory = File.rmIfExistsSyncWithOptions({
	recursive: true,
	force: true
});

export const resetOutput = (): IOTryT<unknown> =>
	pipe(
		Process.cwd(),
		IO.map(createOutputPath),
		IOEither.fromIO,
		IOEither.chainFirst((path) => rmOutputDirectory(path)),
		IOEither.chain((path) => File.mkdirSync(path))
	);
