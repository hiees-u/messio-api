import { GetAllPageResult } from 'src/modules/pages/types/get-all-pages.result';
import { FacebookPageGraphResponse } from 'src/providers/facebook/dtos/facebook-page.graph.response';

type SetPagesGraphInput = {
  f_account_id: number;
  pages: FacebookPageGraphResponse[];
  error?: any;
};

type SetPagesInput = GetAllPageResult;

export type { SetPagesGraphInput, SetPagesInput };
