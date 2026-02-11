import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const project = this.projectRepo.create(createProjectDto);
      return await this.projectRepo.save(project);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  findAll() {
    return this.projectRepo.find({ relations: ['tasks', 'organization'] });
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['tasks', 'organization'],
    });
    if (!project) throw new NotFoundException(`Project #${id} not found`);
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);

    try {
      this.projectRepo.merge(project, updateProjectDto);
      return await this.projectRepo.save(project);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    const project = await this.findOne(id);

    try {
      await this.projectRepo.remove(project);
      return { message: `Project #${id} deleted successfully` };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      throw new BadRequestException('Database validation failed for project');
    }
    throw error;
  }
}