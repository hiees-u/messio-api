import { Injectable } from '@nestjs/common';

import { SettingService } from './setting/setting.service';
import { RedisPagesService } from 'src/infrastructure/redis/pages/pages.service';
import { TokenEncryptionService } from 'src/infrastructure/crypto/token-encryption.service';
import { FacebookPageApiGraph } from 'src/providers/facebook/services/facebook-page-api.service';

import { PagesCacheType } from 'src/infrastructure/redis/pages/page-cache.type';
import { UsePageRepository } from './repositories/page.repository';
import { UserAccessTokenRepository } from './repositories/access-token.repository';
import { FaceBookPage } from 'src/generated/prisma/client';
import { CreatePermissionInput } from '../auth/permissions/dto/create-permission.dto';
import { GetAllPageResult } from './types/get-all-pages.result';
import { UseFacebookAccountRepository } from './repositories/facebook-account.repository';
import { RegisterPageRequestDto } from './dtos/register-pages.request.dto';
import type { RegisterPagesResult } from './dtos/register-pages-response.dto';
import { WorkSpacesService } from '../workspaces/workspaces.service';
// import { SetPagesGraphInput } from 'src/infrastructure/redis/pages/types/set-pages-graph.input';
import { FacebookPageGraphResponse } from 'src/providers/facebook/dtos/facebook-page.graph.response';
import { PageMapper } from './pages.mapper';
import { CreatePageInput } from './types/create-page.input';

@Injectable()
export class PagesService {
  constructor(
    private readonly tokenEncryption: TokenEncryptionService,
    private readonly redisPageService: RedisPagesService,
    private readonly useAccessToken: UserAccessTokenRepository,
    private readonly facebookPageApiGraph: FacebookPageApiGraph,
    private readonly usePageRepository: UsePageRepository,
    private readonly settingService: SettingService,
    private readonly workSpaceService: WorkSpacesService,
    private readonly useFacebookAccountRepository: UseFacebookAccountRepository,
  ) {}

  async getAllPagesUser(
    id: number,
    fAcounts: number[],
  ): Promise<GetAllPageResult | undefined> {
    try {
      let facebookAccountId = fAcounts;
      if (facebookAccountId.length === 0) {
        facebookAccountId =
          await this.useFacebookAccountRepository.getFacebookAccountIdByUserId(
            id,
          );
      }

      let pages: GetAllPageResult = await this.redisPageService.getPagesUserId(
        id,
        facebookAccountId,
      );

      if (Object.keys(pages).length === 0) {
        const tokens =
          await this.getTokenDecodeByFAccountIds(facebookAccountId);
        if (tokens.length > 0) {
          pages = (
            await Promise.all(
              tokens.map(async (token) => {
                try {
                  const pages: FacebookPageGraphResponse[] =
                    await this.facebookPageApiGraph.getPages(token.token);

                  return {
                    [token.userFacebookId]:
                      PageMapper.toCreatePageResponse(pages),
                  };
                } catch (error) {
                  const timeLine = Date.now();
                  console.log(
                    `Called get pages with GraphQL was error in time ${timeLine}: `,
                    error,
                  );
                  return {
                    [token.userFacebookId]: [],
                  };
                }
              }),
            )
          ).reduce((result, current) => {
            return { ...result, ...current };
          }, {});

          void this.redisPageService.setPagesRedis(id, pages);
        }
      }
      return pages;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllPagesUserWithPageIds(
    id: number,
    fAccounts: number[],
    pageIds: string[],
  ): Promise<GetAllPageResult | undefined> {
    const getAllPagesUserResult: GetAllPageResult | undefined =
      await this.getAllPagesUser(id, fAccounts);

    if (!getAllPagesUserResult) return undefined;

    const result: GetAllPageResult = {};

    for (const key of Object.keys(getAllPagesUserResult)) {
      const pages = getAllPagesUserResult[Number(key)];

      const filteredPages = pages.filter((page) => pageIds.includes(page.id));

      if (filteredPages.length > 0) {
        result[Number(key)] = filteredPages;
      }
    }

    return result;
  }

  private async getTokenDecodeByFAccountIds(fAccountIds: number[]) {
    const tokens =
      await this.useAccessToken.getTokenByFacebookAccountId(fAccountIds);

    const tokenDecodes = tokens.map((token) => {
      const tokenDecode = this.tokenEncryption.decrypt(token.token);
      return {
        token: tokenDecode,
        userFacebookId: token.userFacebookId,
      };
    });

    return tokenDecodes;
  }

  async registerPages(
    id: number,
    requests: RegisterPageRequestDto[],
  ): Promise<RegisterPagesResult | null> {
    const fAccountIds = requests.map((req) => req.accountFacebookId);
    const pageIds: string[] = requests.reduce(
      (result: string[], item: RegisterPageRequestDto) => {
        return [...result, ...item.pageIds];
      },
      [],
    );

    const getAllPageResponseResult: GetAllPageResult =
      (await this.getAllPagesUserWithPageIds(id, fAccountIds, pageIds)) || {};

    const pages: PagesCacheType[] = [];
    const getAllPageResponseResultValue: PagesCacheType[] = Object.values(
      getAllPageResponseResult as Record<number, PagesCacheType[]>,
    ).flat();

    getAllPageResponseResultValue.forEach((item) => {
      if (pageIds.includes(item.id)) {
        pages.push(item);
      }
    });

    const pagesMap = new Map(pages.map((page) => [page.id, page.token]));

    const pageIdsRegisterResult = await this.handlerRegisterPages(pagesMap); //id page of meta
    const createPagePayload: CreatePageInput[] = [];

    Object.keys(getAllPageResponseResult).map((key) => {
      const keyNumber: number = Number(key);
      getAllPageResponseResult[keyNumber].map((page: PagesCacheType) => {
        page.registered = pageIdsRegisterResult.includes(page.id);
        if (page.registered) {
          const data: CreatePageInput = {
            userFacebookId: keyNumber,
            name: page.name,
            pageId: page.id,
            tasks: page.tasks,
            token: page.token,
          };
          createPagePayload.push(data);
        }
        return page;
      });
      //set redis
      void this.redisPageService.setPageRedis(
        id,
        keyNumber,
        getAllPageResponseResult[keyNumber],
      );
    });

    //page db = page setting db
    return this.createPagesWorkFlow(id, createPagePayload);
  }

  async createPagesWorkFlow(
    userId: number,
    data: CreatePageInput[],
  ): Promise<FaceBookPage[] | null> {
    const pages: FaceBookPage[] =
      await this.usePageRepository.createFacebookPages(data);

    if (pages.length <= 0) return null;

    const pageIds = pages.map((p) => p.id);

    void this.settingService.createDefaultSettingPages(pageIds);

    const userPer: CreatePermissionInput = {
      userId,
    };
    void this.workSpaceService.assignUserToPages(pageIds, userPer);

    return pages;
  }

  async getPageDb(pageId: string) {
    return await this.usePageRepository.getPageDb(pageId);
  }

  /**
   * params: pagesMap: Map<pageid, token>,
   * Return a list of successfully registered pageIds.
   */
  async handlerRegisterPages(pagesMap: Map<string, string>): Promise<string[]> {
    const result: string[] = await Promise.allSettled(
      [...pagesMap].map(async ([key, value]) => {
        if (!value) {
          return {
            pageId: null,
          };
        }
        const val = await this.facebookPageApiGraph.registerPage(key, value);
        return {
          pageId: val.success ? key : null,
        };
      }),
    ).then((res) => {
      return res.reduce((result: string[], item) => {
        if (item.status === 'fulfilled' && item.value.pageId)
          return [...result, item.value.pageId || ''];
        return result;
      }, []);
    });
    return result;
  }
}
