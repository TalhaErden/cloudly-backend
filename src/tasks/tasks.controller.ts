import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto'; // Yeni oluşturduğumuz DTO

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // --- CHALLENGE ENDPOINT ---
  // İstek: PATCH /tasks/1/move
  // Body: { "targetProjectId": 5 }
  @Patch(':id/move')
  moveTask(@Param('id') id: string, @Body() moveTaskDto: MoveTaskDto) {
    // URL'den gelen id string gelir, başına + koyarak number'a çeviriyoruz.
    return this.tasksService.moveTask(+id, moveTaskDto.targetProjectId);
  }
}