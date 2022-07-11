# Abacus 'Hello World' App Template

A basic Abacus application with a router contract that can dispatch messages.

This is a template repository from which new repos can be created.

## Setup

```sh
# Install dependencies
yarn 

# Build source and generate types
yarn build
```

## Test

```sh
# Run all unit tests
yarn test

# Lint check code
yarn lint
```

## Deployment

##### Hardhat local deployment
```
npx hardhat node
npx hardhat run src/scripts/deploy.ts
```

##### Debug
- Export environment variable `export DEBUG=abacus:*` in the command line or add in front of commands

## Learn more

For more information, see the [Abacus documentation](https://docs.useabacus.network/abacus-docs/developers/getting-started).
