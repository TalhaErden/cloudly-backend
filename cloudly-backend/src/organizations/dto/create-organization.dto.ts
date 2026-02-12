import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Cloudly' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Name cannot be empty or only whitespace' })
  name: string;

  @ApiPropertyOptional({ example: 'Istanbul, TR' })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  address?: string;
}