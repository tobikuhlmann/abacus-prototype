import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import {
  alfajores_private_key,
  kovan_json_rpc_provider,
  kovan_private_key
} from "./secrets.json";


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    alfajores: {
      url: `https://alfajores-forno.celo-testnet.org`,
      accounts: [alfajores_private_key]
    },
    kovan: {
      url: kovan_json_rpc_provider,
      accounts: [kovan_private_key]
    }
  },
  solidity: {
    compilers: [
      {
        version: '0.8.13',
      },
    ],
  },
  gasReporter: {
    currency: 'USD',
  },
  typechain: {
    outDir: './src/types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
  },
};
