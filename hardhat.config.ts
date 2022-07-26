import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import {
  alfajores_private_key,
  kovan_json_rpc_provider,
  kovan_private_key,
  celoscan_alfajores_api_key,
  etherscan_kovan_api_key
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
  mocha: {
    timeout: 100000
  },
  etherscan: {
    apiKey: {
      kovan: etherscan_kovan_api_key,
      alfajores: celoscan_alfajores_api_key
    },
    customChains: [
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/",
          browserURL: "https://alfajores.celoscan.io/"
        }
      },
      {
        network: "kovan",
        chainId: 42,
        urls: {
          apiURL: "https://api-kovan.etherscan.io/",
          browserURL: "https://kovan.etherscan.io/"
        }
      },
      ]
  }
};
