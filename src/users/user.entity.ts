import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../books/book.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Book, (book) => book.user)
  books!: Book[];
}

export type PublicUser = Omit<User, 'passwordHash'>;

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
}
