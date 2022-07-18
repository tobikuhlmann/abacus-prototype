import {
  ChainMap,
  RouterConfig,
} from '@abacus-network/sdk';
import {ethers} from "hardhat";
import {StaticCeloJsonRpcProvider} from "@abacus-network/celo-ethers-provider";
import {
  alfajores_private_key,
  kovan_json_rpc_provider,
  kovan_private_key
} from "../../secrets.json";

export type HelloWorldConfig = RouterConfig;

const alfajores_provider =
    new StaticCeloJsonRpcProvider('https://alfajores-forno.celo-testnet.org')
const kovan_provider = new ethers.providers.JsonRpcProvider(kovan_json_rpc_provider)

const alfajores_signer = new ethers.Wallet(alfajores_private_key, alfajores_provider);
const kovan_signer = new ethers.Wallet(kovan_private_key, kovan_provider);
export const signers_addresses = [alfajores_signer.address, kovan_signer.address]

const alfajores = {
  provider: alfajores_provider,
  confirmations: 1,
  signer: alfajores_signer,
};
const kovan = {
  provider: kovan_provider,
  confirmations: 1,
  signer: kovan_signer,
};

export const mentoTestnet2Configs = {
  alfajores: alfajores,
  kovan: kovan,
};

export function getConfigMap(
  signerAddress: Array<string>,
): ChainMap<'alfajores' | 'kovan', { owner: string }> {
  return {
    alfajores: {
      owner: signerAddress[0],
    },
    kovan: {
      owner: signerAddress[1],
    },
  };
}
