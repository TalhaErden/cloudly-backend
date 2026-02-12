import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = this.taskRepo.create(createTaskDto);
      return await this.taskRepo.save(task);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  findAll() {
    return this.taskRepo.find({ relations: ['project'] });
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project', 'project.organization'],
    });

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);

    // Validate projectId if provided
    if (updateTaskDto.projectId) {
      const projectExists = await this.projectRepo.findOne({
        where: { id: updateTaskDto.projectId }
      });
      
      if (!projectExists) {
        throw new BadRequestException(`Project #${updateTaskDto.projectId} not found`);
      }
    }

    try {
      this.taskRepo.merge(task, updateTaskDto);
      return await this.taskRepo.save(task);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    const task = await this.findOne(id);

    try {
      await this.taskRepo.remove(task);
      return { message: `Task #${id} deleted successfully` };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async moveTask(taskId: number, targetProjectId: number) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['project', 'project.organization'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const targetProject = await this.projectRepo.findOne({
      where: { id: targetProjectId },
      relations: ['organization'],
    });

    if (!targetProject) throw new NotFoundException('Target project not found');

    if (task.project.organization.id !== targetProject.organization.id) {
      throw new BadRequestException(
        'Cannot move task to a project in a different organization!',
      );
    }

    task.project = targetProject;

    try {
      return await this.taskRepo.save(task);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      throw new BadRequestException('Database validation failed for task');
    }
    throw error;
  }
}