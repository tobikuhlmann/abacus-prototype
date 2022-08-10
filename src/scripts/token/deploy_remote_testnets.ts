import {
  AbacusCore,
  serializeContracts,
  MultiProvider,
} from '@abacus-network/sdk';
import '@nomiclabs/hardhat-ethers';
import {
  getConfigMap,
  extendWithTokenConfig,
  mentoTestnet2Configs,
  signers_addresses,
} from '../../deploy/token/config_remote_testnets';
import { tokenConfig } from '../../deploy/token/config_local_testnets';
import { MentoPrototypeTokenDeployer } from '../../deploy/token/deploy';
import { writeFileSync } from 'fs';
import verificationJson from '../../constants/token/remote_test_verification.json';

async function main() {
  const multiProvider = new MultiProvider(mentoTestnet2Configs);

  const core = AbacusCore.fromEnvironment('testnet2', multiProvider);
  const connection_config = core.extendWithConnectionClientConfig(
    getConfigMap(signers_addresses),
  );
  const config = extendWithTokenConfig(connection_config, tokenConfig);

  const deployer = new MentoPrototypeTokenDeployer(multiProvider, config, core);
  const chainToContracts = await deployer.deploy();
  const addresses = serializeContracts(chainToContracts);
  console.info('===Contract Addresses===');
  console.info(addresses);
  writeFileSync(
    './src/constants/token/remote_deployment_addresses.json',
    JSON.stringify(addresses),
  );

  verificationJson.alfajores[0].name = 'MentoPrototypeToken';
  verificationJson.alfajores[0].address =
    chainToContracts.alfajores.router.address;
  verificationJson.alfajores[0].constructorArguments = '';
  verificationJson.kovan[0].name = 'MentoPrototypeToken';
  verificationJson.kovan[0].address = chainToContracts.kovan.router.address;
  verificationJson.kovan[0].constructorArguments = '';
  writeFileSync(
    './src/constants/token/remote_test_verification.json',
    JSON.stringify(verificationJson),
  );
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
