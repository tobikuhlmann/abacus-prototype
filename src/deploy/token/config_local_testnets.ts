import { ChainMap, TestChainNames, objMap } from '@abacus-network/sdk';
import {
  MentoPrototypeTokenConfig,
  MentoPrototypeTokenRouterConfig,
} from './types';
import { ethers } from 'ethers';

export const tokenConfig: MentoPrototypeTokenConfig = {
  name: 'MentoPrototypeToken',
  symbol: 'MPT',
  totalSupply: ethers.BigNumber.from(1000000),
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

export function extendWithTokenConfig(
  config,
  tokenConfig,
): ChainMap<TestChainNames, MentoPrototypeTokenRouterConfig> {
  return objMap(config, (chain, config) => {
    return {
      ...config,
      ...tokenConfig,
    };
  });
}
