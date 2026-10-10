import { ApiProperty } from '@nestjs/swagger';
import { CreatePermissionInput } from 'src/modules/auth/permissions/dto/create-permission.dto';

export class CreatePermissionRequestSchema implements CreatePermissionInput {
  @ApiProperty({
    example: 123,
  })
  userId!: number;

  @ApiProperty({
    type: [String],
    example: ['READ', 'WRITE'],
  })
  permission!: string[];
}

export class CreateWorkSpaceRequestSchema {
  @ApiProperty({
    type: [CreatePermissionRequestSchema],
  })
  user!: CreatePermissionRequestSchema[];
}
