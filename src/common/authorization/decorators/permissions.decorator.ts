import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissions';

export interface PermissionMetadata {
  permission: string;
  field?: string;
}

export const Permission = (metadata: PermissionMetadata) => {
  return SetMetadata(PERMISSION_KEY, metadata);
};
