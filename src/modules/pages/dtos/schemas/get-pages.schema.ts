import { ApiProperty } from '@nestjs/swagger';

export class GetPageSchema {
  @ApiProperty({
    type: [Number],
    example: [124591, 10239],
  })
  accountIds!: number[];
}
