import { ApiProperty } from '@nestjs/swagger';
import { RegisterPageRequestDto } from '../register-pages.request.dto';

export class RegisterPagesDto {
  @ApiProperty({
    type: Object,
    example: [
      {
        accountFacebookId: 1812,
        pageIds: ['1241', '1245'],
      },
    ],
  })
  request!: RegisterPageRequestDto[];
}
