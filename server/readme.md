# Task Tracker Server

NestJS backend for Task Tracker

</br>

## [API Documentation](https://documenter.getpostman.com/view/32343835/2sB2cPk5iX)

## File Structure

- config - Environmental configuration
- database - Database configurations and augmentations
  - potgres - Postgres
  - redis - Redis
- modules - Core modules of the application organized into API versions
- middleware - Shared middleware between modules
- utils - Shared utilities between modules

</br>

## Basic Commands

- `pnpm dev` - Starts the server in dev mode
- `pnpm build` - Builds the server
- `pnpm start` - Builds and runs the server in production mode

## Running migrations and seeders

- `pnpm migrate` - Runs migrations

- `pnpm seed` - Runs seeders

- `pnpm rollback`- Rollbacks migrations

</br>

## Tests

- `pnpm test` - First test execution may take some time since it starts 2 docker containers for Postgres and Redis.

</br>
