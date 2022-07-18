import {
  AbacusCore,
  serializeContracts,
  MultiProvider
} from '@abacus-network/sdk';
import '@nomiclabs/hardhat-ethers';
import { getConfigMap, mentoTestnet2Configs , signers_addresses } from '../deploy/config_remote_testnets';
import { HelloWorldDeployer } from '../deploy/deploy';

async function main() {

  const multiProvider = new MultiProvider(mentoTestnet2Configs);

  const core = AbacusCore.fromEnvironment('mento_testnet2', multiProvider);
  const config = core.extendWithConnectionClientConfig(
    getConfigMap(signers_addresses),
  );

  const deployer = new HelloWorldDeployer(multiProvider, config, core);
  const chainToContracts = await deployer.deploy();
  const addresses = serializeContracts(chainToContracts);
  console.info('===Contract Addresses===');
  console.info(JSON.stringify(addresses));
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
