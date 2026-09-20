import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PaymentMethod } from '@tudongnro/shared-types';

export class CreateOrderDto {
  @ApiProperty({ example: '65f8a...', description: 'ID của sản phẩm tool cần mua' })
  @IsString()
  @IsNotEmpty({ message: 'productId không được để trống' })
  productId: string;

  @ApiProperty({ example: 'plan_30d', description: 'ID gói thời hạn đã chọn' })
  @IsString()
  @IsNotEmpty({ message: 'planId không được để trống' })
  planId: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.VIETQR })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
