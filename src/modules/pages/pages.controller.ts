import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PagesService } from './pages.service';
import { JwtAuthGuard } from 'src/common/authentication/guards/jwt-auth.guard';

import type { RequestWithUser } from 'src/common/authentication/dto/request-with-user.type';
import { RegisterPagesDto } from './dtos/schemas/register-pages.schema';
import { GetPageSchema } from './dtos/schemas/get-pages.schema';
import { Permission } from 'src/common/authorization/decorators/permissions.decorator';

@Controller('pages')
export class PagesController {
  constructor(private readonly pageService: PagesService) {}

  @Post('all-pages')
  @ApiBearerAuth('JWT')
  @Permission({ permission: 'ADMIN' })
  @UseGuards(JwtAuthGuard)
  async getPages(@Req() req: RequestWithUser, @Body() body: GetPageSchema) {
    return await this.pageService.getAllPagesUser(
      Number(req.user.id),
      body.accountIds,
    );
  }

  @Post('page/register')
  @ApiBearerAuth('JWT')
  @Permission({ permission: 'ADMIN' })
  @UseGuards(JwtAuthGuard)
  async registerPage(
    @Req() req: RequestWithUser,
    @Body() body: RegisterPagesDto,
  ) {
    const pagesSuccess = await this.pageService.registerPages(
      Number(req.user.id),
      body.request,
    );

    if (!pagesSuccess || pagesSuccess.length <= 0) {
      return {
        message: 'Page registered failed',
      };
    }

    return {
      message: 'Page registered successfully',
      pages: [...pagesSuccess],
    };
  }
}
