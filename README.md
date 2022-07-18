# Mento Abacus Prototype

This prototype is based on the Abacus App Template (https://github.com/abacus-network/abacus-app-template) and is testing Abacus functionality for the Mento decentralized reserve. 

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

##### Local deployment
```
npx hardhat node
npx hardhat run src/scripts/deploy_local_testnets.ts --network localhost
```

##### Remote testnet deployment
```
npx hardhat run src/scripts/deploy_remote_testnets.ts
```

##### Debug
- Export environment variable `export DEBUG=abacus:*` in the command line or add in front of commands

