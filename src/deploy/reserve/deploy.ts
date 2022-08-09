import {
  AbacusCore,
  AbacusRouterDeployer,
  ChainMap,
  ChainName,
  MultiProvider,
} from '@abacus-network/sdk';
import {
  MentoCrossChainReserveContracts,
  mentoCrossChainReserveFactories,
  MentoCrossChainReserveFactories,
} from '../../app/reserve/contracts';
import { MentoCrossChainReserveRouterConfig } from './types';

export class MentoCrossChainReserveDeployer<
  Chain extends ChainName,
> extends AbacusRouterDeployer<
  Chain,
  MentoCrossChainReserveRouterConfig,
  MentoCrossChainReserveContracts,
  MentoCrossChainReserveFactories
> {
  constructor(
    multiProvider: MultiProvider<Chain>,
    configMap: ChainMap<Chain, MentoCrossChainReserveRouterConfig>,
    protected core: AbacusCore<Chain>,
  ) {
    super(multiProvider, configMap, mentoCrossChainReserveFactories, {});
  }

  // Custom contract deployment logic can go here
  // If no custom logic is needed, call deployContract for the router
  async deployContracts(
    chain: Chain,
    config: MentoCrossChainReserveRouterConfig,
  ) {
    const router = await this.deployContract(chain, 'router', [
      config.mentoPrototypeTokenAddress,
      config.abacusConnectionManager,
      config.interchainGasPaymaster,
    ]);
    return {
      router,
    };
  }
}
