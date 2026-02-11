import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

  
  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      const org = this.orgRepo.create(createOrganizationDto);
      return await this.orgRepo.save(org);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  findAll() {
    return this.orgRepo.find({ relations: ['projects'] });
  }

  async findOne(id: number) {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['projects'],
    });
    if (!org) throw new NotFoundException(`Organization #${id} not found`);
    return org;
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.findOne(id);

    try {
      this.orgRepo.merge(organization, updateOrganizationDto);
      return await this.orgRepo.save(organization);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    const organization = await this.findOne(id);
    try {
      await this.orgRepo.remove(organization);
      return { message: `Organization #${id} deleted successfully` };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      throw new BadRequestException('Database validation failed for organization');
    }
    throw error;
  }
}