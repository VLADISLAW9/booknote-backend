import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Book } from './books/book.entity';
import { BooksModule } from './books/books.module';
import { getDatabasePath } from './database/database.config';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: getDatabasePath(),
      entities: [User, Book],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
