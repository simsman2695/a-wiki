# Restify + TypeScript + Node


## Pre-reqs
- Install [Node.js](https://nodejs.org/en/)

## Getting started
- Clone the repository
```
git clone https://code.hq.twilio.com/mgagliardo/facial-recognition-api.git <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```
Navigate to:
- (local instance)
  - `https://localhost:8888`

## Purpose
Provides a backend for [facial-recognition](https://code.hq.twilio.com/mgagliardo/facial-recognition)

## Getting TypeScript
TypeScript itself is simple to add to any project with `npm`.
```
npm install -D typescript
```

## Building the project
It is rare for JavaScript projects not to have some kind of build pipeline these days, however Node projects typically have the least amount build configuration.
Because of this I've tried to keep the build as simple as possible.
If you're concerned about compile time, the main watch task takes ~2s to refresh.

### Configuring TypeScript compilation
TypeScript uses the file `tsconfig.json` to adjust project compile options.
Let's dissect this project's `tsconfig.json`, starting with the `compilerOptions` which details how your project is compiled.

```json
        "compilerOptions": {
            "module": "commonjs",
            "target": "es6",
            "noImplicitAny": true,
            "moduleResolution": "node",
            "sourceMap": true,
            "outDir": "dist",
            "baseUrl": ".",
            "paths": {
                "*": [
                    "node_modules/*",
                    "src/types/*"
                ]
            }
        },
```

| `compilerOptions` | Description |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `"module": "commonjs"`             | The **output** module type (in your `.js` files). Node uses commonjs, so that is what we use           |
| `"target": "es6"`                  | The output language level. Node supports ES6, so we can target that here                               |
| `"noImplicitAny": true`            | Enables a stricter setting which throws errors when something has a default `any` value                |
| `"moduleResolution": "node"`       | TypeScript attempts to mimic Node's module resolution strategy. Read more [here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#node)                                                                    |
| `"sourceMap": true`                | We want source maps to be output along side our JavaScript. See the [debugging](#debugging) section          |
| `"outDir": "dist"`                 | Location to output `.js` files after compilation                                                       |
| `"baseUrl": "."`                   | Part of configuring module resolution. See [path mapping section](#installing-dts-files-from-definitelytyped) |
| `paths: {...}`                     | Part of configuring module resolution. See [path mapping section](#installing-dts-files-from-definitelytyped) |


## Testing
For this project, I chose [Jest](https://facebook.github.io/jest/) as our test framework. Using this along with [Supertest](https://github.com/visionmedia/supertest) creates a powerful and effecting test suite.

### Running tests

Running tests is a straight forward process.

```
npm test  // performs all tests under the test directory
```

### Running TSLint
Like the rest of our build steps, we use npm scripts to invoke TSLint.
To run TSLint you can call the main build script or just the TSLint task.
```
npm run build   // runs full build including TSLint
npm run tslint  // runs only TSLint
```
Notice that TSLint is not a part of the main watch task.
It can be annoying for TSLint to clutter the output window while in the middle of writing a function, so I elected to only run it only during the full build.
If you are interesting in seeing TSLint feedback as soon as possible, I strongly recommend the [TSLint extension in VS Code]().
