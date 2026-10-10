import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import type { CreateSettingInput } from '../types/create-setting.input';

@Injectable()
export class SettingRepository {
  constructor(private prisma: PrismaService) {}

  createSetting(setting: CreateSettingInput) {
    return this.prisma.pageSetting.create({
      data: {
        pageId: setting.pageId,
        isActive: setting.isActive ?? true,
        isAlertEmail: setting.isAlertEmail ?? false,
      },
    });
  }

  async createDefaultSettingPages(pageIds: number[]) {
    return await this.prisma.pageSetting.createManyAndReturn({
      data: pageIds.map((pageId) => ({
        pageId,
        isActive: true,
        isAlertEmail: false,
      })),
      skipDuplicates: true,
    });
  }
}
