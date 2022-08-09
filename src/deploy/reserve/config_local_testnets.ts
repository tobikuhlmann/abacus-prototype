import { ChainMap, TestChainNames } from '@abacus-network/sdk';

export function getReserveConfigMap(
  signerAddress: string,
  prototypeTokenAddresses,
): ChainMap<
  TestChainNames,
  { owner: string; mentoPrototypeTokenAddress: string }
> {
  return {
    test1: {
      owner: signerAddress,
      mentoPrototypeTokenAddress: prototypeTokenAddresses.test1.router,
    },
    test2: {
      owner: signerAddress,
      mentoPrototypeTokenAddress: prototypeTokenAddresses.test2.router,
    },
    test3: {
      owner: signerAddress,
      mentoPrototypeTokenAddress: prototypeTokenAddresses.test3.router,
    },
  };
}
