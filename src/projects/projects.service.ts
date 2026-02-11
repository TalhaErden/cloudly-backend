import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto) {
    // organizationId'yi DTO'dan alıp entity'ye çevirir
    const project = this.projectRepo.create(createProjectDto);
    return this.projectRepo.save(project);
  }

  findAll() {
    return this.projectRepo.find({ relations: ['tasks'] });
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['tasks', 'organization']
    });
    if (!project) throw new NotFoundException(`Project #${id} not found`);
    return project;
  }
}