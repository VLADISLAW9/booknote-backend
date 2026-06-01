import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum ReadingStatus {
  Reading = 'reading',
  Read = 'read',
  NotRead = 'not_read',
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  genre!: string;

  @Column()
  totalPages!: number;

  @Column({ default: 0 })
  currentPage!: number;

  @Column({ type: 'varchar', default: ReadingStatus.NotRead })
  readingStatus!: ReadingStatus;

  @Column({ type: 'varchar', nullable: true })
  cover!: string | null;

  @Column({ type: 'text', nullable: true })
  annotation!: string | null;

  @Column({ type: 'datetime', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  finishedAt!: Date | null;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
