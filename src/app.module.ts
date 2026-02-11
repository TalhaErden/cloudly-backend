import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [OrganizationsModule, ProjectsModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
