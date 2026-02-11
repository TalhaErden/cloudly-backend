import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Ekle
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity'; // <--- Ekle

@Module({
  imports: [TypeOrmModule.forFeature([Project])], // <--- Sadece kendi tablosu yeterli
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}