import {
  ChainMap,
  TestChainNames,
  chainConnectionConfigs,
  objMap
} from '@abacus-network/sdk';
import {MentoPrototypeTokenConfig, MentoPrototypeTokenRouterConfig} from './types'
import {ethers} from "ethers";

// TODO reduce this config boilerplate

export const testConfigs = {
  test1: chainConnectionConfigs.test1,
  test2: chainConnectionConfigs.test2,
  test3: chainConnectionConfigs.test3,
};

export const tokenConfig: MentoPrototypeTokenConfig = {
  name: 'MentoPrototypeToken',
  symbol: 'MPT',
  totalSupply: ethers.BigNumber.from("1000000"),
};

export function getConfigMap(
  signerAddress: string,
): ChainMap<TestChainNames, { owner: string }> {
  return {
    test1: {
      owner: signerAddress,
    },
    test2: {
      owner: signerAddress,
    },
    test3: {
      owner: signerAddress,
    },
  };
}

export function extendWithTokenConfig<T>(
    config,
    tokenConfig,
): ChainMap<TestChainNames, MentoPrototypeTokenRouterConfig> {
  return objMap(config, (chain, config) => {
    return {
      ...config,
      ...tokenConfig,
    };
  })
};