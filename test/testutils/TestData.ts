import * as Json from '@craigmiller160/ts-functions/Json';
import { getDataFromFile } from '../../src/data';
import { legalDataV, personalDataV } from '../../src/data/decoders';
import { pipe } from 'fp-ts/function';
import path from 'path';
import { IOT } from '@craigmiller160/ts-functions/types';
import * as Process from '@craigmiller160/ts-functions/Process';

const getTestPersonalDataPath = (): IOT<string> =>
    pipe(
        Process.cwd()
    )

export const getTestData = () => {
    pipe(
        getDataFromFile()
    )
}