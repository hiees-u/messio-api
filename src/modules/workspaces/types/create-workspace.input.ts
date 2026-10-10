import { CreatePermissionInput } from 'src/modules/auth/permissions/dto/create-permission.dto';

export interface CreateWorkSpaceInput {
  pageId: number;
  userRequests: CreatePermissionInput[];
}
