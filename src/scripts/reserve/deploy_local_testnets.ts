import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';

import {
  AbacusCore,
  getTestMultiProvider,
  serializeContracts,
  testChainConnectionConfigs,
} from '@abacus-network/sdk';
import { getReserveConfigMap } from '../../deploy/reserve/config_local_testnets';
import { MentoCrossChainReserveDeployer } from '../../deploy/reserve/deploy';
import {
  extendWithTokenConfig,
  tokenConfig,
  getConfigMap,
} from '../../deploy/token/config_local_testnets';
import { MentoPrototypeTokenDeployer } from '../../deploy/token/deploy';
import { writeFileSync } from 'fs';

async function main() {
  const [signer] = await ethers.getSigners();
  const multiProvider = getTestMultiProvider(
    signer,
    testChainConnectionConfigs,
  );
  const core = AbacusCore.fromEnvironment('test', multiProvider);

  // ===== Dependency deployment Mento Prototype Token =====
  const connection_config = core.extendWithConnectionClientConfig(
    getConfigMap(signer.address),
  );
  const tokenDeployerConfig = extendWithTokenConfig(
    connection_config,
    tokenConfig,
  );
  const tokenDeployer = new MentoPrototypeTokenDeployer(
    multiProvider,
    tokenDeployerConfig,
    core,
  );
  const tokenChainToContracts = await tokenDeployer.deploy();
  const tokenAddresses = serializeContracts(tokenChainToContracts);
  console.info('===Token Contract Addresses===');
  console.info(JSON.stringify(tokenAddresses));

  // ===== Deployment Mento Cross-chain reserve =====
  const reserveConfig = core.extendWithConnectionClientConfig(
    getReserveConfigMap(signer.address, tokenAddresses),
  );
  const reserveDeployer = new MentoCrossChainReserveDeployer(
    multiProvider,
    reserveConfig,
    core,
  );
  const reserveChainToContracts = await reserveDeployer.deploy();

  const addresses = serializeContracts(reserveChainToContracts);
  console.info('===Contract Addresses===');
  console.log(addresses);
  writeFileSync(
    './src/constants/reserve/local_deployment_addresses.json',
    JSON.stringify(addresses),
  );
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
