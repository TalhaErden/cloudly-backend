import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  organizationId: number; // İlişkiyi ID üzerinden yönetmek için

  // Bir proje tek bir organizasyona aittir
  @ManyToOne(() => Organization, (organization) => organization.projects, {
    onDelete: 'CASCADE', // Organizasyon silinirse projeleri de sil
  })
  organization: Organization;

  // Bir projenin birden çok görevi olabilir
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}