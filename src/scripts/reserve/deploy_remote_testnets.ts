import {
  AbacusCore,
  serializeContracts,
  MultiProvider,
} from '@abacus-network/sdk';
import '@nomiclabs/hardhat-ethers';
import {
  mentoTestnet2Configs,
  signers_addresses,
} from '../../deploy/token/config_remote_testnets';
import {
  getReserveConfigMap,
} from '../../deploy/reserve/config_remote_testnets';
import tokenDeploymentAddresses from '../../constants/token/remote_deployment_addresses.json'
import {writeFileSync} from "fs";
import {MentoCrossChainReserveDeployer} from "../../deploy/reserve/deploy";
import {exportConstructorArguments} from "./utils";

async function main() {
  const multiProvider = new MultiProvider(mentoTestnet2Configs);

  const core = AbacusCore.fromEnvironment('testnet2', multiProvider);

  // ===== Deployment Mento Cross-chain reserve =====
  const reserveConfig = core.extendWithConnectionClientConfig(
      getReserveConfigMap(signers_addresses, tokenDeploymentAddresses), //tokenAddresses
  );
  const reserveDeployer = new MentoCrossChainReserveDeployer(
      multiProvider,
      reserveConfig,
      core,
  );
  const reserveChainToContracts = await reserveDeployer.deploy();

  const addresses = serializeContracts(reserveChainToContracts);
  console.info('===Reserve Contract Addresses===');
  console.info(addresses);
  writeFileSync('./src/constants/reserve/remote_deployment_addresses.json', JSON.stringify(addresses));

  // TODO: send some Mento Prototype Token to the reserve contracts

  // ===== export verification data ====
  exportConstructorArguments(reserveConfig, reserveChainToContracts);
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
