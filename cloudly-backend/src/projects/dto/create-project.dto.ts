import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ example: 'Platform Migration' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Name cannot be empty or only whitespace' })
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  organizationId: number;
}