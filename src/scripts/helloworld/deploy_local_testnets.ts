import '@nomiclabs/hardhat-ethers';

import {
  AbacusCore,
  getTestMultiProvider,
  serializeContracts,
  testChainConnectionConfigs,
} from '@abacus-network/sdk';
import { ethers } from 'hardhat';
import { getConfigMap } from '../../deploy/helloworld/config_local_testnets';
import { HelloWorldDeployer } from '../../deploy/helloworld/deploy';

async function main() {
  const [signer] = await ethers.getSigners();
  const multiProvider = getTestMultiProvider(
    signer,
    testChainConnectionConfigs,
  );

  const core = AbacusCore.fromEnvironment('test', multiProvider);
  const config = core.extendWithConnectionClientConfig(
    getConfigMap(signer.address),
  );

  const deployer = new HelloWorldDeployer(multiProvider, config, core);
  const chainToContracts = await deployer.deploy();
  const addresses = serializeContracts(chainToContracts);
  console.info('===Contract Addresses===');
  console.info(JSON.stringify(addresses));
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
