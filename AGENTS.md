# Repository Guidelines

## Project Context

NestJS backend for Booknote, a web app for tracking a user's book library and reading progress. Core domains are users, JWT authentication, and user-owned books.

## Project Structure & Module Organization

Application code lives in `src/`. `main.ts` bootstraps Nest and Swagger; `app.module.ts` wires TypeORM and feature modules. Domain code is grouped by folder: `src/auth/` for registration, login, JWT, password hashing, and guards; `src/users/` for the user entity and repository service; `src/books/` for book CRUD, DTOs, and entity; `src/database/` for SQLite config. Do not edit `dist/` or `data/*.sqlite`.

## Build, Run, and Development Commands

Use Yarn because this repo includes `yarn.lock`.

- `yarn install`: install dependencies.
- `yarn start`: run the compiled Nest app.
- `yarn start:dev`: run Nest in watch mode.
- `yarn build`: compile TypeScript to `dist/`.
- `yarn typecheck`: run `tsc --noEmit`.
- `yarn lint`: run ESLint and apply safe fixes.
- `yarn format`: run Prettier over TypeScript files.

Swagger UI: `http://localhost:3000/api/docs`. OpenAPI JSON: `/api/docs-json`.

## Coding Style & Naming Conventions

Follow NestJS conventions: modules, controllers, services, entities, and DTOs stay in their feature folder. Use `PascalCase` for classes such as `BooksService` and `CreateBookDto`; use kebab-case filenames such as `books.service.ts`. Prefer constructor injection and repository services. Controller DTOs should be classes for Swagger.

## Database & Configuration

The app uses TypeORM with SQLite. Default path is `data/booknote.sqlite`; override with `DATABASE_PATH`. `synchronize: true` is enabled for early development, but replace it with migrations before production. JWT uses `JWT_SECRET` and optional `JWT_EXPIRES_IN`; set a strong secret outside local development.

## API Guidelines

Book endpoints are protected by `JwtAuthGuard` and must scope reads/writes by `userId`. Never fetch, update, or delete a book by `id` alone. Reading statuses are stored as `reading`, `read`, and `not_read`; API input may also accept `Читаю`, `Прочитана`, and `Не прочитана`.

## Testing Guidelines

Automated tests are intentionally absent. Do not add Jest or test scripts unless the team explicitly reintroduces tests. Verify changes with `yarn lint`, `yarn typecheck`, `yarn build`, and targeted manual API checks through Swagger or HTTP requests.

## Commit & Pull Request Guidelines

There is no commit history to infer a house style. Use concise, imperative messages such as `Add books CRUD` or `Document auth endpoints`. Pull requests should describe behavior changes, list verification commands, and call out schema, auth, or configuration impact.

## Security Tips

Do not commit secrets, `.env` files, SQLite data files, `dist/`, or generated local artifacts. Keep all user-owned resources scoped to the authenticated user and avoid returning password hashes from any response.
