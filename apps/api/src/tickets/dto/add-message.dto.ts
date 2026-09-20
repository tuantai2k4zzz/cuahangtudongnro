import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddMessageDto {
  @ApiProperty({ example: 'Kỹ thuật viên đã kiểm tra sao kê, đơn hàng đã được kích hoạt thành công.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
