# Mento Abacus Prototype [Work in progress]

This prototype is loosely based on the Abacus App Template (https://github.com/abacus-network/abacus-app-template) and is testing Abacus cross-chain functionality for the Mento decentralized reserve. 

## Applications
##### Governance
Mento Governance Prototype based on the Abacus controller. The Celo governance contract will be the only address able to make onlyOwner transaction calls on the reserve contracts on all chains.
##### HelloWorld
Playground for Abacus messages to get to know the sdk and cross-chain messaging
##### Reserve
Cross-chain reserve which holds the Mento prototype token and can rebalance cross-chain via Abacus
##### Token
Mento Cross-chain Prototype Token based on the Abacus AbcERC20 token standard

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
yarn hardhat node
yarn hardhat run src/scripts/{$application}/deploy_local_testnets.ts --network localhost
```

##### Remote testnet deployment
```
yarn hardhat run src/scripts/{$application}/deploy_remote_testnets.ts
```

##### Debug
- Export environment variable `export DEBUG=abacus:*` in the command line or add in front of commands

