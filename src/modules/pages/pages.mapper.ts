import { Injectable } from '@nestjs/common';

import type { FacebookPageGraphResponse } from 'src/providers/facebook/dtos/facebook-page.graph.response';
import type { GetPageResult } from './types/get-pages.result';

@Injectable()
export class PageMapper {
  static toCreatePageResponse(
    pages: FacebookPageGraphResponse[],
  ): GetPageResult[] {
    return pages.map((page: FacebookPageGraphResponse) => {
      return {
        id: page.id,
        token: page.access_token,
        name: page.name,
        tasks: page.tasks,
        registered: false,
      };
    });
  }
}
