import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { TicketCategory } from '@tudongnro/shared-types';

export class CreateTicketDto {
  @ApiProperty({ example: 'Nguyễn Văn Đạt' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'dat.nro@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '0983542830', required: false })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ enum: TicketCategory, example: TicketCategory.THANH_TOAN })
  @IsEnum(TicketCategory)
  category: TicketCategory;

  @ApiProperty({ example: 'NRO-88219', required: false })
  @IsOptional()
  @IsString()
  orderCode?: string;

  @ApiProperty({ example: 'Cần hỗ trợ kiểm tra tiền nạp MBBank chưa cộng key' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'Tôi đã chuyển 150.000đ nhưng chưa thấy key hiện lên trang quản lý.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
