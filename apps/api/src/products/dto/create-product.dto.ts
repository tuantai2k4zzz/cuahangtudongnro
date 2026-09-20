import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory, ProductStatus } from '@tudongnro/shared-types';

export class ProductPlanDto {
  @ApiProperty({ example: 'plan_30d' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: 'Gói 30 Ngày' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  durationDays: number;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  originalPrice: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isPopular?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Auto NRO Pro Ultimate' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'auto-nro-pro-ultimate' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Phần mềm toàn diện tối ưu hóa tự động hóa mọi hoạt động NRO Online' })
  @IsString()
  @IsNotEmpty()
  tagline: string;

  @ApiProperty({ example: 'Mô tả chi tiết sản phẩm...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.ALL_IN_ONE })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ example: 'v4.8.2' })
  @IsString()
  @IsNotEmpty()
  currentVersion: string;

  @ApiProperty({ type: [ProductPlanDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductPlanDto)
  plans: ProductPlanDto[];
}
