<h1 align="center">GoldFish API</h1>

# api

This repo is for the 0.5 api of `foundation` a Postgres v15 DB on GCP, managed
by [crunchydata/crunchbridge](https://crunchybridge.com/clusters/3opz5w7ysnap3hdpjfrxal7jq4) located at
host `p.3opz5w7ysnap3hdpjfrxal7jq4.db.postgresbridge.com`

For access message `ryan-taylor`

## v0.5 Spec 01.04.2023

- migrate from existing MongoDB
- move datasets from google-docs into Postgres
- develop a simple api to unlock front end engineering for `saga`
- documentation
- test cases

## Source code directory:

- common: general functions are abstracted for reuse
- constants: Declare fixed ENUMs or constants.
- database: manage libraries to manipulate the database.
- decorators: Decorator class to draw logic can be used in many places, https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841
- docs: Swagger configuration for API documentation
- exceptions: catch and handle exceptions thrown from within the application.
- filters: similar in structure to exceptions, but mostly handled before the response reaches the user.
- guards: the gate that checks the user's ability to authenticate.
- interfaces: where the declaration of interfaces, types of classes are reused.
- modules: manage all modules of the system. Example: Auth, User, Mail. In each module there should be at least 3 files: *.module, *.controller, *.service.
- shared: the place where helpers, services, configurations are system-wide (global)
- validators: filter the input of the request's parameters.


## Workflow define

- Each function is divided into a separate Module. Example: Auth Module, User Module
- There are 4 main layers in the architecture, including: Controller, Service, Model (Prisma), View.
  - Currently due to API there is no need to display. So sometimes you won't need the View layer.
  - Controller: Receives and filters the input params to the Services and returns the results.
  - Service: combined with Model to handle logic. After processing, it will be returned to the Controller.
  - Model: interacts with the database and returns the results to the Service.


## Configurations

.env file:

```bash
#== ENVIRONMENT
NODE_ENV=<production or development>

#== APP
PORT=<port to run the app>
DOMAIN=<domain of the app>

#== JWT Auth
JWT_KEY=<paste a key for JWT_KEY>
JWT_ACCESS_EXPIRATION_TIME=3600
JWT_REFRESH_EXPIRATION_TIME=86400

#== DB
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=db_name
POSTGRES_USER=root
POSTGRES_PASSWORD=root
DATABASE_URL=postgresql://root:root@localhost:5432/db_name
POSTGRES_DIR=/path/to/dir_data

# Mail
MAIL_HOST=smtp.example.com
MAIL_USER=user@example.com
MAIL_PASSWORD=
MAIL_FROM=noreply@example.com

#== Storage
DOMAIN_STORAGE=http://localhost:4000
AWS_IAM_USER_KEY=
AWS_IAM_USER_SECRET=
AWS_IAM_USER_BUCKET=
DO_ENDPOINT=
```

## Install and run the app

For development (Node 16, Yarn):

```bash
$ yarn
$ yarn dev
```

For running on live servers:

```bash
# starting all container
$ docker-compose up -d
# starting specific database 
$ docker-compose up -d postgres
# starting specific api
$ docker-compose up -d api

```
PORT is value in .env
Access http://localhost:[PORT]/ and http://localhost:[PORT]/docs

## Migration

```bash
# All structure for database in this file 
$ src/database/prisma/schema.prisma
```

```bash
# Example

model Token { // Name of Entity / Model in prisma model -> this.prisma.token.create
  id        BigInt      @id // Primary ID https://www.npmjs.com/package/snowflake-id
  token     String      @unique // normal column with UNIQUE index, cannot nullable 
  status    TokenStatus? @default(ISSUED) // normal column with ENUM and have null value
  user      User        @relation(fields: [userId], references: [id]) // Relationship to another table. n-1
  userId    BigInt  // Relationship to another table. n-1
  subTokens subTokens[] // Relationship to another table. 1-n
  permissions TokenPermission[] // Relationship to another table. n-n
  createdAt DateTime    @default(now()) // time created this record
  updatedAt DateTime    @updatedAt // time updated this record
  @@map("Tokens") // name of table in database
}

model User { // Name of Entity / Model in prisma model -> this.prisma.token.create
  id        BigInt      @id // Primary ID https://www.npmjs.com/package/snowflake-id
  tokens    token[] // Relationship to another table. 1-n
  createdAt DateTime    @default(now()) // time created this record
  updatedAt DateTime    @updatedAt // time updated this record

  @@map("Users") // name of table in database
}


model Permission { // Name of Entity / Model in prisma model -> this.prisma.token.create
  id        BigInt      @id // Primary ID https://www.npmjs.com/package/snowflake-id
  value     string
  tokens    TokenPermission[]
  createdAt DateTime    @default(now()) // time created this record
  updatedAt DateTime    @updatedAt // time updated this record

  @@map("Permissions") // name of table in database
}

model TokenPermission {
  permission    Permissions  @relation(fields: [permissionId], references: [id])
  permissionId  BigInt
  token         Token     @relation(fields: [tokenId], references: [id])
  tokenId       BigInt
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@id([tokenId, permissionId])
  @@map("TokenPermission")
}

```

```bash
# Run migrations. Notice: Please DATABASE_URL ENV before run command
# Only run in Development ENV.  
$ npx prisma migrate dev --schema=src/database/prisma/schema.prisma

# Run in Production ENV 
npx prisma migrate deploy --schema=src/database/prisma/schema.prisma npx prisma generate --schema=src/database/prisma/schema.prisma

```

## Import Static data


```bash
1. Download original data from link below and put it into src/modules/convert/datasets
https://drive.google.com/file/d/1Hqym7lMBi1Abq9B5KVctDKTyIyGHXIhQ/view
2. Make sure you did set DATABASE_URL in .env and run success migrate 
3. Run this command for all tables
$ ts-node src/modules/convert/commander/convert.command.ts convert
4. If you only want to run specific table. Please comment in this file 
src/modules/convert/commander/convert.command.ts
```


## Deploy

```bash
# You need set completely environment.

# Beta branch: it's the same as the production env
# Master branch: it's the same as the development env. 
 
```


## Another Database (Repository Layer)

```bash
I have added a layer of database abstraction for you to change in the future.
See this file on line number 76. You can convert the database type you want.
$ src/modules/static/static.module.ts

Here there are 2 types CountryPrismaRepository and CountryKnexRepository
$src/modules/static/repository/country/country.prisma.repository.ts
$ src/modules/static/repository/country/country.knex.repository.ts

You can change any type of database you want. Just rewrite the communication configuration with the new database. No need to modify logic

```


Reference: MobileFolk Team

## Stripe Service
* Stripe Config
  * Stripe PUBLISH
  * STRIPE_SECRET_KEY=
  * STRIPE_PUBLISH_KEY=
  * STRIPE_CALL_BACK=""
    * Link back when on stripe interface
  * STRIPE_URL_SUCCESS_CHECKOUT=""
    * Link when checkout is successful
  * STRIPE_URL_CANCEL_CHECKOUT="Link when canceling checkout"
* Redis Config
  * REDIS_HOST=
  * REDIS_PORT=6379
  * REDIS_PASSWORD=
* Implement Stripe payment on website
  * [Api List Plans] GET: /stripe/plans (Get the plans that have been created on the stripe, show them on the GoldFish website)
  * When the user chooses any plan
    * [API Create checkout session] POST: /stripe/create-checkout-session
    * Redirect to url on response
  * POST: /stripe/create-billing-portal (When the user wants to see the history of paid subscriptions)
    * Redirect to url on response
* Weebhook
  * Listen stripe webhook
* WorkFlow Stripe Customer
  * <img src="https://i.imgur.com/ZZUYQCg.png">
* WorkFlow Stripe Webhook
  * <img src="https://i.imgur.com/45FpvFB.png">