import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'TODO' }) // Varsayılan durum
  status: string;

  @Column()
  projectId: number; // İlişkiyi ID üzerinden yönetmek için

  // Bir görev tek bir projeye aittir
  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE', // Proje silinirse görevleri de sil
  })
  project: Project;
}