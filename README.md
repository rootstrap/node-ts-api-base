# express-api-base

This project includes the boilerplate for a basic rest-api made in Node.JS with Express + Typescript.

## Basic Requirements

1. Install Node.js (lts-version v12.18.3)
2. Install `yarn` if not present `curl -o- -L https://yarnpkg.com/install.sh | bash` (macOS and generic Unix environments)
3. Install required dependencies by `yarn`
4. `cp .example.env .env`
5. `cp .example.env.test .env.test`
6. Create your DB (i.e. psql for Postgres: `psql -U <user> -h <host> -c "create database <db name>;"`) with same name as your .env file.
7. Run `yarn db:setup`.
8. Start your server with `yarn dev`.

## Some scripts

Run `yarn build` to build js from typescript source.

Run `yarn start` to start the server from the compiled folder (/dist).

Run `yarn test` to run tests.

Run `yarn dev` to start and automatically detect any source-code changes, restarting the server as well.

Run `yarn schema:drop` to drop your schema of the DB.

Run `yarn schema:sync` to resync the schema of your DB.

Run `yarn seed:run` to run seed files.

Run `yarn db:reset` to drop schema and re run it, then seed the DB.

## App scaffolding

This is the suggested scaffolding for this project. You can take a look at:

```bash
.
├── __tests__
│   └── ...
├── src
│   ├── config
│   │   └── ...
│   ├── controllers
│   │   └── ...
│   ├── database
│   │   └── ...
│   ├── entities
│   │   └── ...
│   ├── services
│   │   └── ...
│   ├── app.ts            (App root and is where the application will be configured.)
├── README.md
├── .nvmrc                (Locks down your Node version.)
├── jest.config.js        (Jest configuration file.)
├── yarn-lock.json
├── package.json          (Your application’s package manifest.)
├── tsconfig.json         (The TypeScript project configuration.)
```

## Dependencies

- [AdminBro](https://adminbro.com/) - Admin panel middleware.
- [routing-controllers](https://github.com/typestack/routing-controllers) - Create structured class-based controllers with decorators usage in Express.
- [typeorm](https://typeorm.io/#/) - NodeJS ORM.
- [nodemon](https://nodemon.io/) - Utility that will monitor for any changes in your source and automatically restart your server.
- [multer](https://github.com/expressjs/multer) -  NodeJS middleware for handling multipart/form-data.
- [tsconfig-paths](https://github.com/dividab/tsconfig-paths#readme) - Utility to register relative paths set at tsconfig file

## Deployment with docker

Work in progress ...

## Docs

[Express documentation](https://expressjs.com/es/)
[Typescript documentation](https://www.typescriptlang.org/)

## Credits

**Express API Base** is maintained by [Rootstrap](http://www.rootstrap.com) with the help of our [contributors](https://github.com/rootstrap/express-api-base/graphs/contributors).

[<img src="https://s3-us-west-1.amazonaws.com/rootstrap.com/img/rs.png" width="100"/>](http://www.rootstrap.com)
