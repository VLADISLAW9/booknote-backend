# Repository Guidelines

## Project Context

This repository contains the backend for a web application that tracks books users have read. Keep domain language and feature boundaries aligned with reading progress, books, notes, users, and related library workflows.

## Project Structure & Module Organization

This is a NestJS backend written in TypeScript. Application code lives in `src/`: `main.ts` bootstraps the HTTP server, `app.module.ts` wires providers/controllers, and the starter `app.controller.ts` / `app.service.ts` show the expected Nest module pattern. Build output goes to `dist/` and should not be edited. Keep new features grouped by domain under `src/<feature>/` with the usual Nest files, for example `books/books.module.ts`, `books/books.controller.ts`, and `books/books.service.ts`. Unit tests should sit beside implementation files as `*.spec.ts`; e2e tests, when added, belong under `test/`.

## Build, Test, and Development Commands

Use Yarn, as this repo includes `yarn.lock`.

- `yarn install`: install dependencies.
- `yarn start`: run the app once with Nest.
- `yarn start:dev`: run in watch mode for local development.
- `yarn build`: compile TypeScript to `dist/`.
- `yarn lint`: run ESLint and apply safe fixes.
- `yarn format`: run Prettier on `src/**/*.ts` and `test/**/*.ts`.
- `yarn test`: run unit tests with Jest.
- `yarn test:cov`: run Jest with coverage output in `coverage/`.
- `yarn test:e2e`: run e2e tests using `test/jest-e2e.json` once that config exists.

## Coding Style & Naming Conventions

Follow NestJS conventions: classes use `PascalCase`, providers/controllers/modules use descriptive suffixes such as `BookService`, `BookController`, and `BookModule`, and files use kebab-case with Nest suffixes like `book.service.ts`. Prefer dependency injection over manual construction. ESLint uses TypeScript-aware rules plus Prettier; run `yarn lint` and `yarn format` before submitting changes. The TypeScript target is ES2023, decorators are enabled, and `strictNullChecks` is on, so handle nullable values explicitly.

## Testing Guidelines

Jest is configured in `package.json` with `rootDir: "src"` and `testRegex: ".*\\.spec\\.ts$"`. Add focused unit tests beside the code they cover, for example `books.service.spec.ts`. Use `@nestjs/testing` for modules/providers and mock external boundaries. Run `yarn test` for normal checks and `yarn test:cov` when changing shared logic or behavior with meaningful branching.

## Commit & Pull Request Guidelines

This repository currently has no commit history to infer a house style. Use concise, imperative commit messages such as `Add books service` or `Fix validation error handling`. Pull requests should describe the change, list test commands run, call out configuration or migration impact, and link related issues when available. Include API examples or screenshots only when the external behavior changes.

## Security & Configuration Tips

Do not commit secrets, local `.env` files, generated coverage, or `dist/`. Keep environment-specific values behind configuration providers rather than hardcoding them in modules or services.
