import * as File from '@craigmiller160/ts-functions/File';
import * as Process from '@craigmiller160/ts-functions/Process';
import { IOT, IOTryT } from '@craigmiller160/ts-functions/types';
import { PersonalData, personalDataV } from './decoders';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import * as IO from 'fp-ts/IO';
import path from 'path';
import * as TypeValidation from '@craigmiller160/ts-functions/TypeValidation';
import { logger } from '../logger';
import * as Json from '@craigmiller160/ts-functions/Json';

const decodeData = TypeValidation.decode(personalDataV);

const getPersonalDataFilePath = (): IOT<string> =>
	pipe(
		Process.cwd(),
		IO.map((cwd) => path.join(cwd, 'data', 'personalData.json'))
	);

export const getPersonalData = (): IOTryT<PersonalData> =>
	pipe(
		logger.info('Loading personal data'),
		IO.chain(getPersonalDataFilePath),
		IOEither.rightIO,
		IOEither.chain((filePath) => File.readFileSync(filePath)),
		IOEither.chainFirstIOK((content) =>
			logger.debug(`Personal Data: ${content}`)
		),
		IOEither.chainEitherK(Json.parseE),
		IOEither.chainEitherK(decodeData)
	);
