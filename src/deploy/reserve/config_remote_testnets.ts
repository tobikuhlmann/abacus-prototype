import { ChainMap } from '@abacus-network/sdk';

export function getReserveConfigMap(
  signerAddress: Array<string>,
  prototypeTokenAddresses,
): ChainMap<
  'alfajores' | 'kovan',
  { owner: string; mentoPrototypeTokenAddress: string }
> {
  return {
    alfajores: {
      owner: signerAddress[0],
      mentoPrototypeTokenAddress: prototypeTokenAddresses.alfajores.router,
    },
    kovan: {
      owner: signerAddress[1],
      mentoPrototypeTokenAddress: prototypeTokenAddresses.kovan.router,
    },
  };
}
