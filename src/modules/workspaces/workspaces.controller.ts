import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/authentication/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/common/authorization/guards/permission.guard';
import { CreateWorkSpaceRequestSchema } from './dtos/schemas/assign-users-for-page.schema';
import { WorkSpacesService } from './workspaces.service';
import { Permission } from 'src/common/authorization/decorators/permissions.decorator';

@Controller('work-spaces')
export class WorkSpacesController {
  constructor(private readonly workSpaceService: WorkSpacesService) {}

  @Post('page/:id/assign')
  @ApiBearerAuth('JWT')
  @Permission({ permission: 'ADMIN', field: 'params.id' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  pageAssign(
    @Param('id', ParseIntPipe) pageId: number,
    @Body() userSchemas: CreateWorkSpaceRequestSchema,
  ) {
    return this.workSpaceService.assignUsersToPage({
      pageId,
      userRequests: userSchemas.user,
    });
  }
}
