import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';

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
  console.log('chainToContracts');
  console.log(chainToContracts.test1);
  const addresses = serializeContracts(chainToContracts);
  console.info('===Contract Addresses===');
  console.info(JSON.stringify(addresses));
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
