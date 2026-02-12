import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement tenant guard' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Title cannot be empty or only whitespace' })
  title: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}