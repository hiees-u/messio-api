import { FacebookPageGraphResponse } from 'src/providers/facebook/dtos/facebook-page.graph.response';
import { PagesCacheType } from '../page-cache.type';

export class PageCacheMapper {
  static fromGraph(data: FacebookPageGraphResponse[]): PagesCacheType[] {
    return data.map((page: FacebookPageGraphResponse) => {
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
