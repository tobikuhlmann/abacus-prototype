import {
  AbacusCore,
  AbacusRouterDeployer,
  ChainMap,
  ChainName,
  MultiProvider,
} from '@abacus-network/sdk';
import {
  MentoPrototypeTokenContracts,
  mentoPrototypeTokenFactories,
  MentoPrototypeTokenFactories,
} from '../../app/token/contracts';
import { MentoPrototypeTokenRouterConfig } from './types';

export class MentoPrototypeTokenDeployer<
  Chain extends ChainName,
> extends AbacusRouterDeployer<
  Chain,
  MentoPrototypeTokenRouterConfig,
  MentoPrototypeTokenContracts,
  MentoPrototypeTokenFactories
> {
  constructor(
    multiProvider: MultiProvider<Chain>,
    configMap: ChainMap<Chain, MentoPrototypeTokenRouterConfig>,

    protected core: AbacusCore<Chain>,
  ) {
    super(multiProvider, configMap, mentoPrototypeTokenFactories, {});
  }

  // Custom contract deployment logic can go here
  // If no custom logic is needed, call deployContract for the router
  async deployContracts(chain: Chain, config: MentoPrototypeTokenRouterConfig) {
    const router = await this.deployContract(chain, 'router', []);
    await router.initialize(
      config.abacusConnectionManager,
      config.interchainGasPaymaster,
      config.totalSupply,
      config.name,
      config.symbol,
    );
    return {
      router,
    };
  }
}
