import { ChainMap, TestChainNames } from '@abacus-network/sdk';

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
