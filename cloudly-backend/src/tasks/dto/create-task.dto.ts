import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement tenant guard' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/\S/, { message: 'Title cannot be empty or whitespace' })
  title: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  projectId: number;
}