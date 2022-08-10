import {
  AbacusCore,
  buildContracts,
  ChainMap,
  ChainName,
  getTestMultiProvider,
  testChainConnectionConfigs,
} from '@abacus-network/sdk';
import { ethers } from 'hardhat';
import { HelloWorldChecker } from '../../deploy/helloworld/check';
import { getConfigMap } from '../../deploy/helloworld/config_local_testnets';
import { HelloWorldApp } from '../../app/helloworld/app';
import {
  HelloWorldContracts,
  helloWorldFactories,
} from '../../app/helloworld/contracts';
import testEnvironmentAddresses from '../../constants/helloworld/localt_test_addresses.json';

async function check() {
  const [signer] = await ethers.getSigners();
  const multiProvider = getTestMultiProvider(
    signer,
    testChainConnectionConfigs,
  );

  const contractsMap = buildContracts(
    testEnvironmentAddresses,
    helloWorldFactories,
  ) as ChainMap<ChainName, HelloWorldContracts>;

  const app = new HelloWorldApp(contractsMap, multiProvider);

  const core = AbacusCore.fromEnvironment('test', multiProvider);
  const config = core.extendWithConnectionClientConfig(
    getConfigMap(signer.address),
  );

  const helloWorldChecker = new HelloWorldChecker(multiProvider, app, config);
  await helloWorldChecker.check();
  helloWorldChecker.expectEmpty();
}

check()
  .then(() => console.info('Check complete'))
  .catch(console.error);
