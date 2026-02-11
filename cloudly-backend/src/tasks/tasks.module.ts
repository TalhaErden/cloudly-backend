import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Bunu ekle
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity'; // <--- Entity'i import et
import { Project } from '../projects/entities/project.entity'; // <--- Project Entity'sini de import et

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project])], // <--- Veritabanı tablolarını buraya tanımlıyoruz
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}