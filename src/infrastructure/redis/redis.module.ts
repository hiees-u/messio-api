import { Global, Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { RedisPagesService } from './pages/pages.service';
import { RedisPermissionService } from './permission/permission.service';

@Global()
@Module({
  providers: [RedisProvider, RedisPagesService, RedisPermissionService],
  exports: [RedisProvider, RedisPagesService, RedisPermissionService],
})
export class RedisModule {}
