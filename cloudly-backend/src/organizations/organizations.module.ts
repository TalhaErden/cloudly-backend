import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Ekle
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization } from './entities/organization.entity'; // <--- Ekle

@Module({
  imports: [TypeOrmModule.forFeature([Organization])], // <--- Sadece kendi tablosu yeterli
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}