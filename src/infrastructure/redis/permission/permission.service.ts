import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisPermissionService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private getPermissionKey(workSpaceId: number): string {
    return `workspace:${workSpaceId}:permissions`;
  }

  private getOwnerPageKey(userId: number): string {
    return `${userId}owner:pages`;
  }

  async hasOwnerPage(userId: number, pageId: number): Promise<boolean> {
    const key = this.getOwnerPageKey(userId);
    const hasOwner = await this.redis.sismember(key, pageId);
    return hasOwner === 1;
  }

  async addOwnerPage(userId: number, pageId: number | number[]) {
    if (Array.isArray(pageId))
      await this.redis.sadd(this.getOwnerPageKey(userId), ...pageId);
    else await this.redis.sadd(this.getOwnerPageKey(userId), pageId);
  }

  async removeOwnerPage(userId: number, pageId: number) {
    await this.redis.srem(this.getOwnerPageKey(userId), pageId);
  }

  async hasPermissionWithPage(
    workSpaceId: number,
    permission: string,
  ): Promise<boolean> {
    const permissionKey = this.getPermissionKey(workSpaceId);
    const hasPermission = await this.redis.sismember(permissionKey, permission);
    return hasPermission === 1;
  }

  async addPermissionToPage(
    workSpaceId: number,
    permission: string,
  ): Promise<void> {
    const permissionKey = this.getPermissionKey(workSpaceId);
    await this.redis.sadd(permissionKey, permission);
  }

  async removePermissionFromPage(
    workSpaceId: number,
    permission?: string | null,
  ): Promise<void> {
    const permissionKey = this.getPermissionKey(workSpaceId);
    if (permission) {
      await this.redis.srem(permissionKey, permission);
    } else {
      await this.redis.del(permissionKey);
    }
  }
}
