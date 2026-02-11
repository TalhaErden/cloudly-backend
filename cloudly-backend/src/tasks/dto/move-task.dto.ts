import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveTaskDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  targetProjectId: number;
}