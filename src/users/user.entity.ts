export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
}
