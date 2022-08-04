import {
  AbacusCore,
  buildContracts,
  ChainMap,
  ChainName,
  getTestMultiProvider,
  testChainConnectionConfigs,
} from '@abacus-network/sdk';
import { ethers } from 'hardhat';
import { HelloWorldChecker } from '../../deploy/reserve/check';
import { getConfigMap } from '../../deploy/reserve/config_local_testnets';
import { HelloWorldApp } from '../../app/reserve/app';
import {
  HelloWorldContracts,
  helloWorldFactories,
} from '../../app/reserve/contracts';
import testEnvironmentAddresses from '../../app/environments/test.json';

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