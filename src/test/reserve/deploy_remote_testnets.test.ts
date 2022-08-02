import { AbacusCore, ChainMap, MultiProvider } from '@abacus-network/sdk';
import '@nomiclabs/hardhat-waffle';
import { HelloWorldChecker } from '../../deploy/reserve/check';
import {
  getConfigMap,
  HelloWorldConfig,
  mentoTestnet2Configs,
  signers_addresses,
} from '../../deploy/reserve/config_remote_testnets';
import { HelloWorldDeployer } from '../../deploy/reserve/deploy';
import { HelloWorldApp } from '../../app/reserve/app';
import { HelloWorldContracts } from '../../app/reserve/contracts';

describe('deploy', async () => {
  type MentoRemoteTestChainNames = 'kovan' | 'alfajores';
  let core: AbacusCore<MentoRemoteTestChainNames>;
  let multiProvider: MultiProvider<MentoRemoteTestChainNames>;
  let config: ChainMap<MentoRemoteTestChainNames, HelloWorldConfig>;
  let deployer: HelloWorldDeployer<MentoRemoteTestChainNames>;
  let contracts: Record<MentoRemoteTestChainNames, HelloWorldContracts>;
  let app: HelloWorldApp<MentoRemoteTestChainNames>;

  before(async () => {
    multiProvider = new MultiProvider(mentoTestnet2Configs);

    core = AbacusCore.fromEnvironment('testnet2', multiProvider);
    config = core.extendWithConnectionClientConfig(
      getConfigMap(signers_addresses),
    );
    deployer = new HelloWorldDeployer(multiProvider, config, core);
  });

  it('deploys', async () => {
    contracts = await deployer.deploy();
  }).timeout(100000);

  it('builds app', async () => {
    contracts = await deployer.deploy();
    app = new HelloWorldApp(contracts, multiProvider);
  }).timeout(100000);

  it('checks', async () => {
    const checker = new HelloWorldChecker(multiProvider, app, config);
    await checker.check();
    checker.expectEmpty();
  });
});
