import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '6aaf8cc39de1c0d4ef70913e' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Tool chạy rất mượt mà, săn boss chuẩn từng giây!' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 'orderId_optional', required: false })
  @IsOptional()
  @IsString()
  orderId?: string;
}
