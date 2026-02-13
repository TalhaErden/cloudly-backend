import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ example: 'Platform Migration' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/\S/, { message: 'Name cannot be empty or whitespace' })
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  organizationId: number;
}