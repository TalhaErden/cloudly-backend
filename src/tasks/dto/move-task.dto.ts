import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveTaskDto {
  @IsNumber()
  @IsNotEmpty()
  targetProjectId: number;
}