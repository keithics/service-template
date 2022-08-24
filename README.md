# Service Template API

> Microservice template

# Table of contents:

- [Pre-reqs](#requirements)
- [Development NPM commands](#development-npm-commands)
- [Libraries and Framworks](#libraries-and-frameworks)
    - [Express](#express)
        - [Catching async errors](#catching-errors-automatically)
        - [Controller Level Validations](#controller-level-validations)
    - [Joi](#joihttpsjoidev)
        - [Route Level Validation](#route-level-validations-using-joi)
    - [Jest](#jest)
    - [Eslint](#eslint)
- [Project Structure](#project-structure)
- [Serializing Jest Snapshots](#serializing-jest-snapshots)
- [Mocking with Jest](#mocking-with-jest)
- [Dependencies](#dependencies)
    - [dependencies](#dependencies)
    - [devDependencies](#devdependencies)
- [Licence](#license)

# Requirements
1. Nodejs 16.x and later (but this should work with older versions as well)
2. MongoDB 4.x
3. VSCode or Webstorm

## Development NPM commands

| Command          | Description                                                        |
|------------------|--------------------------------------------------------------------|
| `npm run dev`    | Development mode                                                   |
| `npm run lint`   | Checks linting and formatting issues in `./src`                    |
| `npm run pretty` | Fixes formatting of any ts files inside  `./src`                   |
| `npm run test`   | Runs all unit and integrations tests eg: `./src/api/**/**.test.ts` |


# Libraries and Frameworks

## Express

> Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

Almost all NodeJs developers know how to use Express, it is perfect for API microservice because of the small footprint with lots of third-party
support. Express is also the lowest common denominator for all tools when it comes to NodeJs. If you talk about Ruby, they have Rails,
Python has Django and PHP has Laravel, and NodeJs is synonymous with Express. One downside for Express over Koa is that it doesn't handle
async errors, all other frameworks based on Express have this kind of flaw as well.
It is already fixed in the next version but adding a quick `catchasync` function can easily fix this issue without the need of `try/catches`

#### Catching Errors Automatically
```ts
    // 👎 too many redundant try/catch
    export const getData = async function (req: Request,res: Response) {
    const { id } = req.body;
    try{
        const user = await User.findOne({ _id:id });
        ...
        ..
        .
    }catch(e){
        throw new GhErrorOther('Invalid ID');
    }
    
        res.jsonp(user);
    
    };
    
    // 👍
    export const getData = catchAsync(async function (req: Request,res: Response) {
        const { id } = req.body;
        const user = await User.findOne({ _id:id });
    
        // automatically sends error 500
        ghAssert(user,GhErrorOther,'Invalid ID');
    
        // we are sure that user is found by the time the code executes after ghAssert
        res.jsonp(user);
    
    });
````

#### Controller Level Validations

```ts
    // 👎 not bad but we can make it better
    export const getData = async function (req: Request,res: Response) {
    const { id } = req.body;
        const user = await User.findOne({ _id:id });
        if(user){
            return res.status(422).send({message:'User is not found'})
        }else{
            res.jsonp(user);    
        }    
        
    };
    
    // 👍 lesser scope and if/else statements
    export const getData = catchAsync(async function (req: Request,res: Response) {
        const { id } = req.body;
        const user = await User.findOne({ _id:id });
    
        // automatically sends error 422
        ghAssert(user,GhValidationError,'User not found');
    
        // we are sure that user is found by the time the code executes after ghAssert
        res.jsonp(user);
    
    });
````
## [Joi](https://joi.dev/)

> Joi is a powerful schema description language and data validator for JavaScript. For validation, Joi can easily integrate with ExpressJs as a middleware.

#### Route Level Validations using Joi
```ts
    // module-name.routes.ts
    // validator function automatically returns 422 for invalid values
    moduleRouter.post('/', validator(myValidator), functionName);
    
    // module-name.validator.ts
    export const myValidator = {
        schema: Joi.object({
            name: Joi.string().required(),
        }),
    };
```

## Jest

> Jest is a delightful JavaScript Testing Framework with a focus on simplicity. Compared to other testing frameworks like Mocha, Jest has more features and doesn't need other libraries like code coverage and mocking.

**Snapshot Testing** - Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly. Although primarily used in React, snapshot testing is a very good tool for APIs. Having a snapshot for API responses will make maintenance easier.

With snapshots, new changes can be monitored and updated if needed. Adding new field will immediately fail test integration.

```shell
    ● Pokemon Tests › CRUD routes › CREATE - Should respond with status code 200

    expect(received).toMatchSnapshot()

    Snapshot name: `Pokemon Tests CRUD routes CREATE - Should respond with status code 200 1`

    - Snapshot  - 1
    + Received  + 0

    @@ -2,9 +2,8 @@
        "__v": 0,
        "_id": "000000000000000000000000",
        "createdAt": "1984-01-24T16:00:00.000Z",
        "deleted": false,
        "name": "Pikachu",
    -   "type": "Electric",
        "updatedAt": "1984-01-24T16:00:00.000Z",
        "user": "000000000000000000000000",
      }

      33 |         .set('Authorization', `Bearer ${token}`);
      34 |       expect(response.status).toEqual(200);
    > 35 |       expect(response.body).toMatchSnapshot();
         |                             ^
      36 |       createdId = response.body._id;
      37 |     });
      38 |
```

#### Creating an integration test example below.

```ts
        beforeAll(async () => {
        await mongo.dropAllCollections();
            // create user
            const fakeUser = await createFakeUser(false);
            token = fakeUser.token;
        });
        
        afterAll(async (done) => {
            await mongo.dropAllCollections();
            await mongo.close();
            done();
        });
        
        describe('Pokemon Tests', () => {
            describe('CRUD routes', () => {
                test('CREATE - Should respond with status code 200', async () => {
                    const response = await request(app)
                    .post('/')
                    .send(json)
                    //
                    .set('Authorization', `Bearer ${token}`);
                    expect(response.status).toEqual(200);
                    expect(response.body).toMatchSnapshot();
                    createdId = response.body._id;
            });
        });    
```        

#### Example test result

```shell
    PASS  src/api/phone/phone.test.ts
    Pokemon Tests
    CRUD routes
    ✓ CREATE - Should respond with status code 200 (50 ms)
    ✓ CREATE WITHOUT TOKEN - Should respond with status code 401 (20 ms)
    ✓ READ ONE  - Should respond with status code 200 (26 ms)
    ✓ READ ONE WITHOUT TOKEN - Should respond with status code 401 (8 ms)
    ✓ PAGINATION - Should respond with status code 401 (21 ms)
    ✓ PAGINATION WITHOUT TOKEN - Should respond with status code 401 (7 ms)
    ✓ UPDATE ONE  - Should respond with status code 200 (16 ms)
    ✓ UPDATE ONE WITHOUT TOKEN  - Should respond with status code 401 (8 ms)
    ✓ DELETE ONE  - Should respond with status code 200 (13 ms)
    ✓ DELETE ONE WITHOUT TOKEN - Should respond with status code 401 (6 ms)
    
    ------------------------|---------|----------|---------|---------|-------------------
    File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
    ------------------------|---------|----------|---------|---------|-------------------
    All files               |   91.11 |        0 |   55.55 |   91.11 |
    api/pokemons            |     100 |      100 |     100 |     100 |
    pokemon.controller.ts   |     100 |      100 |     100 |     100 |
    pokemon.model.ts        |     100 |      100 |     100 |     100 |
    pokemon.routes.ts       |     100 |      100 |     100 |     100 |
    pokemon.validator.ts    |     100 |      100 |     100 |     100 |
    server                  |   86.88 |        0 |      50 |   86.88 |
    app.ts                  |   91.66 |        0 |   33.33 |   91.66 | 36,48,53
    mongo.ts                |      75 |      100 |      75 |      75 | 9-12
    routes.ts               |   88.88 |      100 |       0 |   88.88 | 13
    ------------------------|---------|----------|---------|---------|-------------------
    Test Suites: 2 passed, 2 total
    Tests:       20 passed, 20 total
    Snapshots:   8 passed, 8 total
    Time:        4.088 s
```

## ESLint
ESLint is a code linter which mainly helps catch quickly minor code quality and style issues.

### ESLint rules
Like most linters, ESLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `.eslintrc` configuration file.

### Running ESLint
Like the rest of our build steps, we use npm scripts to invoke ESLint.
To run ESLint you can call the main build script or just the ESLint task.
```
npm run build   // runs full build including ESLint
npm run lint    // runs only ESLint
```

# Project Structure
The most obvious difference in a TypeScript + Node project is the folder structure.
In a TypeScript project, it's best to have separate _source_  and _distributable_ files.
TypeScript (`.ts`) files live in your `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.


The full folder structure of this app is explained below:

| Name                                     | Description                                                                                                |
|------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `.vscode`                                | Contains VS Code specific settings                                                                         |
| `.github`                                | Contains GitHub settings and configurations, including the GitHub Actions workflows                        |
| `.dockerignore`                          | Ignore list for Docker during build process                                                                |
| `.eslintignore`                          | Ignore list for eslint during linting process                                                              |
| `.eslintrc`                              | Config settings for ESLint code style checking                                                             |
| `.prettierrc`                            | Prettier config                                                                                            |
| `dist`                                   | Contains the distributable (or output) from your TypeScript build. This is the code you ship               |
| `Dockerfile`                             | Docker file                                                                                                |
| `jest.config `                           | Jest config                                                                                                |
| `LICENSE`                                | License file                                                                                               |
| `nodemon.json`                           | Nodemon config                                                                                             |
| `node_modules**`                         | Contains all your npm dependencies                                                                         |
| `src**`                                  | Contains your source code that will be compiled to the dist dir                                            |
| `src/libraries** `                       | Common utilities and helpers                                                                               |
| `src/jest/**`                            | Jest configuration directory                                                                               |
| `src/jest/serializer.ts`                 | Jest snapshot serializer                                                                                   |
| `src/jest/setup.ts`                      | Jest setups configs and mocks                                                                              |
| `src/api/**/** `                         | Modules Directory                                                                                          |
| `src/api/<module name>/**.controller.ts` | Controllers define functions that respond to various http requests                                         |
| `src/api/<module name>/**.model.ts `     | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB               |
| `src/api/<module name>/**.routes.ts `    | Module routes                                                                                              |
| `src/api/<module name>/**.types.ts `     | Holds .d.ts files not found on DefinitelyTyped. Covered more in this [section](#type-definition-dts-files) |
| `src/api/<module name>/**.test.ts`       | Contains your tests                                                                                        |
| `src/api/<module name>/**.validator.ts`  | Joi schema validators                                                                                      |
| `src/public** `                          | Static assets that will be used client side                                                                |
| `src/server/**`                          | All server related code                                                                                    |
| `src/server/app.ts`                      | Express app initialization                                                                                 |
| `src/server/config.ts`                   | Express app configs and merging of environment variables from `**.env`                                     |
| `src/server/mongo.ts`                    | Mongoose setup and config, includes dropping of collections for testing                                    |
| `src/server/routes.ts`                   | Express routes main entry                                                                                  |
| `src/index.ts`                           | Express main entry point                                                                                   |
| `**.env `                                | Env variables                                                                                              |
| `jest.config.js`                         | Used to configure Jest running tests written in TypeScript                                                 |
| `package.json `                          | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped) |
| `tsconfig.json `                         | Config settings for compiling server code written in TypeScript                                            |



# Serializing Jest Snapshots
Since snapshot is a simple file diff, there maybe times wherein the response object will change every build.
Let's say _id will always be dynamic and cannot be fixed in each test.
The file `jest.serializer.ts` will replace all dynamic objects values ONLY in the snapshot without mutating the actual response.

> Example below will fail because  createdAt and updatedAt with different values in every test.

```shell
    - Snapshot  - 2
    + Received  + 2

      Object {
        "_id": "000000000000000000000000", // serialized
    -   "createdAt": "1984-01-24T16:00:00.000Z", // not serialized
    +   "createdAt": "2022-06-10T08:11:46.117Z",
        "deleted": false,
        "name": "mimikyu",
    -   "updatedAt": "1984-01-24T16:00:00.000Z",
    +   "updatedAt": "2022-06-10T08:11:46.117Z",
        "user": "000000000000000000000000",
      }
      
```

Default object properties are serialized **even in a nested object**.

1. _id
2. token
3. createdAt
4. updatedAt
5. email
6. password
7. user

# Mocking with Jest

> Mock functions allow you to test the links between code by erasing the actual implementation of a function, capturing calls to the function (and the parameters passed in those calls), capturing instances of constructor functions when instantiated with new, and allowing test-time configuration of return values

> Manual mocks are used to stub out functionality with mock data. For example, instead of accessing a remote resource like a website or a database, you might want to create a manual mock that allows you to use fake data. This ensures your tests will be fast and not flaky.

If the module you are mocking make sure to add it in `./src/jest/jest.setup.ts` , read more about mocking **[here](https://jestjs.io/docs/manual-mocks)**.


```shell
.
├── config
├── __mocks__
│   └── fs.js
├── models
│   ├── __mocks__
│   │   └── user.js
│   └── user.js
├── node_modules
└── views
```

# Dependencies
Dependencies are managed through `package.json`.
In that file you'll find two sections:

## `dependencies`

| Package              | Description                                    |
|----------------------|------------------------------------------------|
| @keithics/auth       | Utility auth library for Keithics              |
| @keithics/code       | Core library for Keithics, includes CRUD class |
| @keithics/errors     | Error library for Keithics eg: `assert`        |
| @keithics/joi        | Common joi validation schemas for Keithics     |
| cors                 | Express 4 cors middleware.                     |
| date-fns             | Lightweight JS date parsing utilities          |
| dotenv               | Loads environment variables from .env file.    |
| express              | Node.js web framework.                         |
| helmet               | Expresss middleware for http security          |
| joi                  | Validation utility library.                    |
| mongoose             | MongoDB ODM.                                   |
| mongoose-delete      | MongoDB middleware for soft deletes            |
| mongoose-paginate-v2 | MongoDB middleware for cursor pagination       |
| morgan               | Logging library                                |

## `devDependencies`

| Package              | Description                                                             |
|----------------------|-------------------------------------------------------------------------|
| @types/*             | Dependencies in this folder are `.d.ts` files used to provide types     |
| @typescript-eslint/* | Eslinst TS plugins                                                      |
| babel-eslint         | Babel TS plugins                                                        |
| chai                 | Testing utility library that makes it easier to write tests             |
| chalk                | Utility that styles Terminal output                                     |
| codelyzer            | Eslinting utility                                                       |
| eslint               | Linter for JavaScript and TypeScript files                              |                                                     |
| eslint-config/*      | Eslint config                                                           |
| eslint-plugin*       | Eslint plugins                                                          |
| nodemon              | Utility that automatically restarts node process when it crashes        |
| prettier             | An opinionated code formatter                                           |
| pretty-format        | Stringify any JavaScript value for prettier                             |
| supertest            | HTTP assertion library.                                                 |
| ts-jest              | A preprocessor with sourcemap support to help use TypeScript with Jest. |
| ts-node              | Enables directly running TS files.                                      |
| ts-node-dev          | Enables directly running TS files during development                    |
| tslint               | Linter for TypeScript files                                             |
| typescript           | JavaScript compiler/type checker that boosts JavaScript productivity    |

# Issues
1. Jest RANDOMBYTESREQUEST error in local machine please see [here](https://stackoverflow.com/questions/65653226/jest-and-randombytesrequest-open-handles)


## License
Copyright (c) Keithics. All rights reserved.
