import {
  ChainMap,
  getTestMultiProvider,
  MultiProvider,
  testChainConnectionConfigs,
  TestChainNames,
  TestCoreApp,
  TestCoreDeployer,
} from '@abacus-network/sdk';
import '@nomiclabs/hardhat-waffle';
import { ethers } from 'hardhat';
import { HelloWorldChecker } from '../../deploy/helloworld/check';
import { getConfigMap } from '../../deploy/helloworld/config_local_testnets';
import { HelloWorldDeployer } from '../../deploy/helloworld/deploy';
import { HelloWorldApp } from '../../app/helloworld/app';
import { HelloWorldContracts } from '../../app/helloworld/contracts';
import { HelloWorldConfig } from '../../deploy/helloworld/types';

describe('deploy', async () => {
  let multiProvider: MultiProvider<TestChainNames>;
  let core: TestCoreApp;
  let config: ChainMap<TestChainNames, HelloWorldConfig>;
  let deployer: HelloWorldDeployer<TestChainNames>;
  let contracts: Record<TestChainNames, HelloWorldContracts>;
  let app: HelloWorldApp<TestChainNames>;

  before(async () => {
    const [signer] = await ethers.getSigners();
    multiProvider = getTestMultiProvider(signer, testChainConnectionConfigs);

    const coreDeployer = new TestCoreDeployer(multiProvider);
    const coreContractsMaps = await coreDeployer.deploy();
    core = new TestCoreApp(coreContractsMaps, multiProvider);
    config = core.extendWithConnectionClientConfig(
      getConfigMap(signer.address),
    );
    deployer = new HelloWorldDeployer(multiProvider, config, core);
  });

  it('deploys', async () => {
    contracts = await deployer.deploy();
  });

  it('builds app', async () => {
    contracts = await deployer.deploy();
    app = new HelloWorldApp(contracts, multiProvider);
  });

  it('checks', async () => {
    const checker = new HelloWorldChecker(multiProvider, app, config);
    await checker.check();
    checker.expectEmpty();
  });
});
