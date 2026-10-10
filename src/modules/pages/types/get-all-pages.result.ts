import { GetPageResult } from './get-pages.result';

export interface GetAllPageResult {
  [key: number]: GetPageResult[];
}
