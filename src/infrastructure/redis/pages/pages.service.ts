import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { PagesCacheType } from './page-cache.type';
import { GetAllPageResult } from 'src/modules/pages/types/get-all-pages.result';

@Injectable()
export class RedisPagesService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async setPageRedis(
    userId: number,
    fAccountId: number,
    pages: PagesCacheType[],
  ): Promise<PagesCacheType[]> {
    try {
      const pipeLine = this.redis.pipeline();
      pages.map((p) => {
        const key = this.getKeyPages(userId, fAccountId, p.id);
        pipeLine.setex(key, 3600, JSON.stringify(p));
      });
      const pipeLineExecResult = await pipeLine.exec();
      const result: PagesCacheType[] = [];
      if (pipeLineExecResult) {
        pipeLineExecResult.map((p, index) => {
          if (!p[0]) {
            result.push(pages[index]);
          }
        });
      }
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async setPagesRedis(
    userId: number,
    pages: GetAllPageResult,
  ): Promise<GetAllPageResult | null> {
    try {
      for (let index = 0; index < Object.keys(pages).length; index++) {
        const fAccountId = Number(Object.keys(pages)[index]);
        const res = await this.setPageRedis(
          userId,
          fAccountId,
          pages[fAccountId],
        );
        pages[fAccountId] = res;
      }

      return pages;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private getKeyPages(
    userId: number,
    fAccountId: number,
    pId?: string,
  ): string {
    if (!pId) return `FB-PAGE:${userId}:${fAccountId}-*`;
    return `FB-PAGE:${userId}:${fAccountId}-${pId}`;
  }

  private async getKeys(key: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, matchedKeys] = await this.redis.scan(
        cursor,
        'MATCH',
        key,
        'COUNT',
        100,
      );

      cursor = nextCursor;
      keys.push(...matchedKeys);
    } while (cursor !== '0');

    return keys;
  }

  async setPages(
    id: number,
    fAccountId: number,
    pages: PagesCacheType[],
  ): Promise<string[]> {
    const pipeLine = this.redis.pipeline();

    pages.map((p) => {
      const key = this.getKeyPages(id, fAccountId, p.id);
      pipeLine.setex(key, 3600, JSON.stringify(p));
    });

    const pipeLineExecResult = await pipeLine.exec();

    const result: string[] = [];
    if (pipeLineExecResult) {
      for (let index = 0; index < pipeLineExecResult.length; index++) {
        if (!pipeLineExecResult[0]) {
          result.push(pages[index].id);
        }
      }
    }

    return result;
  }

  async getPagesUserId(
    id: number,
    fAccountIds: number[],
  ): Promise<GetAllPageResult> {
    try {
      if (fAccountIds.length === 0) return {};

      const pipeLine = this.redis.pipeline();
      let keys: string[] = [];
      await Promise.all(
        fAccountIds.map(async (fai) => {
          const key = this.getKeyPages(id, fai);
          const temptKeys = await this.getKeys(key);
          keys = [...keys, ...temptKeys];
        }),
      );
      pipeLine.mget(keys);
      const pipeLineExecResult = await pipeLine.exec();

      let results: GetAllPageResult = {};
      //kiểm tra tồn tại ít nhất 1 pipeLineExecResult[1] != null
      if (pipeLineExecResult) {
        for (
          let index: number = 0;
          index < pipeLineExecResult.length;
          index++
        ) {
          const pipeLineExecResultValue = pipeLineExecResult[index][1] as [];
          const cachedDatas: PagesCacheType[] = [];
          if (pipeLineExecResultValue) {
            pipeLineExecResultValue.map((data: string) => {
              cachedDatas.push(JSON.parse(data) as PagesCacheType);
            });
            const result: GetAllPageResult = {
              [fAccountIds[index]]: cachedDatas,
            };
            results = { ...results, ...result };
          }
        }
      }
      return results;
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}
