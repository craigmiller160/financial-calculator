import { Context } from '../context';
import { IOTryT } from '@craigmiller160/ts-functions/types';
import * as File from '@craigmiller160/ts-functions/File';
import * as Process from '@craigmiller160/ts-functions/Process';
import path from 'path';
import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as Json from '@craigmiller160/ts-functions/Json';
import * as IOEither from 'fp-ts/IOEither';
import { createOutputPath, PAST_CONTRIBUTION_401K_FILE } from './constants';

const stringify = Json.stringifyIndentE(2);

const writeJsonToFile = (filePath: string, data: object): IOTryT<void> =>
	pipe(
		stringify(data),
		IOEither.fromEither,
		IOEither.chain((json) => File.writeFileSync(filePath)(json))
	);

export const writeDataFiles = (context: Context): IOTryT<Context> =>
	pipe(
		Process.cwd(),
		IO.map(createOutputPath),
		IOEither.fromIO,
		IOEither.chainFirst((outputPath) =>
			writeJsonToFile(
				path.join(outputPath, PAST_CONTRIBUTION_401K_FILE),
				context.pastContribution401k
			)
		),
		IOEither.map(() => context)
	);
