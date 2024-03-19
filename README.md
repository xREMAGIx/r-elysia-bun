# Elysia with Bun runtime

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Project structure

```
.
├── drizzle
│   ├── meta
│   └── *.sql
├── src
│   ├── config
│   │   ├── database.ts
│   │   └── migrate.ts
│   ├── controllers
│   │   └── *.controller.ts
│   ├── libs
│   │   ├── error.ts
│   │   └── plugins.ts
│   ├── models
│   │   └── *.model.ts
│   ├── services
│   │   └── *.service.ts
│   ├── db-schema.ts
│   ├── index.ts
│   └── routes.ts
├── .env
└── drizzle.config.ts
```

- `drizzle`: contain files that auto generated when run drizzle-kit generate
- `config`: includes config files for database, v.v...
- `controllers`: instances which encapsulate multiple endpoints
- `libs`: utility functions and plugins
- `models`: Data Type Objects (DTOs) for Elysia instance
- `services`: consist of logic handlers
- `db-schema.ts`: file contain all the DB schema
- `index.ts`: entry point for your Elysia server, ideal place for setting global plugin
- `routes.ts`: compose of all endpoints
- `.env`: env file
- `drizzle.config.ts`: config file for drizzle migration

## Migration

Follow setup documentation: [Dizzle migrations](https://orm.drizzle.team/docs/migrations)

Here is the setup in this project

```
.
├── drizzle  <-- folder contain files that auto generated when run drizzle-kit generate
│   ├── meta
│   └── *.sql
├── src
│   ├── config
│   │   ├── database.ts  <- file includes script connect to database
│   │   └── migrate.ts  <- file used for running migrate
│   └── db-schema.ts  <- file contain all the DB schema
└── drizzle.config.ts  <- config file for drizzle migration
```

1. First you must declare DB schema in file `db-schema.ts`

2. Generate the migration using `bun drizzle-kit generate:pg`

3. Run the migration by execute `bun src/config/migrate.ts`
