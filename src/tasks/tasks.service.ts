import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(Project) // Challenge için Proje reposunu da çağırdık
    private projectRepo: Repository<Project>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepo.create(createTaskDto);
    return this.taskRepo.save(task);
  }

  findAll() {
    return this.taskRepo.find();
  }

  // --- CHALLENGE KISMI ---
  async moveTask(taskId: number, targetProjectId: number) {
    // 1. Görevi, mevcut projesi ve onun organizasyonu ile birlikte bul
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['project', 'project.organization'],
    });

    if (!task) throw new NotFoundException('Task not found');

    // 2. Hedef projeyi ve onun organizasyonunu bul
    const targetProject = await this.projectRepo.findOne({
      where: { id: targetProjectId },
      relations: ['organization'],
    });

    if (!targetProject) throw new NotFoundException('Target project not found');

    // 3. GÜVENLİK KURALI: Organizasyon ID'leri aynı mı?
    if (task.project.organization.id !== targetProject.organization.id) {
      throw new BadRequestException(
        'Cannot move task to a project in a different organization!',
      );
    }

    // 4. Her şey tamamsa taşı
    task.project = targetProject;
    return this.taskRepo.save(task);
  }
}