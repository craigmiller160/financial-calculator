import { getData } from './data';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';



pipe(
    getData()
)