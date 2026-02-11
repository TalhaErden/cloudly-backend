import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    const org = this.orgRepo.create(createOrganizationDto);
    return this.orgRepo.save(org);
  }

  findAll() {
    return this.orgRepo.find({ relations: ['projects'] }); // İlişkili projeleri de getir
  }

  async findOne(id: number) {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['projects']
    });
    if (!org) throw new NotFoundException(`Organization #${id} not found`);
    return org;
  }
}