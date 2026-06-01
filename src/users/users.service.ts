import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { CreateUserInput, PublicUser, User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  create(input: CreateUserInput): User {
    const user: User = {
      id: randomUUID(),
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString(),
    };

    this.users.set(user.id, user);
    return user;
  }

  findByEmail(email: string): User | null {
    const normalizedEmail = email.trim().toLowerCase();

    for (const user of this.users.values()) {
      if (user.email === normalizedEmail) {
        return user;
      }
    }

    return null;
  }

  findById(id: string): User | null {
    return this.users.get(id) ?? null;
  }

  toPublicUser(user: User): PublicUser {
    const publicUser = { ...user };

    delete (publicUser as Partial<User>).passwordHash;

    return publicUser;
  }
}
