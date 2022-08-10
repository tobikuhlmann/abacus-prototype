import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { writeFileSync } from 'fs';

import {
  AbacusCore,
  getTestMultiProvider,
  serializeContracts,
  testChainConnectionConfigs,
} from '@abacus-network/sdk';
import {
  getConfigMap,
  extendWithTokenConfig,
  tokenConfig,
} from '../../deploy/token/config_local_testnets';
import { MentoPrototypeTokenDeployer } from '../../deploy/token/deploy';

async function main() {
  const [signer] = await ethers.getSigners();
  const multiProvider = getTestMultiProvider(
    signer,
    testChainConnectionConfigs,
  );

  const core = AbacusCore.fromEnvironment('test', multiProvider);
  const connection_config = core.extendWithConnectionClientConfig(
    getConfigMap(signer.address),
  );
  const config = extendWithTokenConfig(connection_config, tokenConfig);

  const deployer = new MentoPrototypeTokenDeployer(multiProvider, config, core);
  const chainToContracts = await deployer.deploy();
  const addresses = serializeContracts(chainToContracts);
  console.info('===Contract Addresses===');
  console.log(addresses)
  writeFileSync('./src/constants/token/local_deployment_addresses.json', JSON.stringify(addresses));
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
