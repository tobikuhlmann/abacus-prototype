import { existsSync, readFileSync, writeFileSync } from 'fs';
import verification from '../../constants/token/remote_test_verification.json';

import { CompilerOptions, MentoChainMap } from '../types';
import { execCmd } from '../../utils/utils';
import { mentoTestnet2Configs } from '../../deploy/helloworld/config_remote_testnets';
import { MultiProvider, ContractVerifier } from '@abacus-network/sdk';
import {
  etherscan_kovan_api_key,
  celoscan_alfajores_api_key,
} from '../../../secrets.json';

async function main() {
  const multiProvider = new MultiProvider(mentoTestnet2Configs);

  const sourcePath = './contracts/token/MentoPrototypeTokenFlattened.sol';

  if (!existsSync(sourcePath)) {
    await execCmd(
      `npx hardhat flatten ./contracts/token/MentoPrototypeToken.sol > ./contracts/token/MentoPrototypeTokenFlattened.sol`,
    );
    let flattenedSource = readFileSync(sourcePath, { encoding: 'utf8' });
    // Make SPDX license identifiers compiler compatible
    flattenedSource = flattenedSource.replace(
      /SPDX-License-Identifier:/gm,
      'License-Identifier:',
    );
    flattenedSource = `// SPDX-License-Identifier: MIXED\n\n${flattenedSource}`;
    writeFileSync(sourcePath, flattenedSource);
  }
  const flattenedSource = readFileSync(sourcePath, { encoding: 'utf8' });

  const compilerOptions: CompilerOptions = {
    codeformat: 'solidity-single-file',
    compilerversion: 'v0.8.13+commit.abaa5c0e',
    optimizationUsed: '0',
    runs: '200',
  };

  // ensures flattened source is compilable
  await execCmd(`solc ${sourcePath}`);

  const apiKeys: MentoChainMap = {
    alfajores: celoscan_alfajores_api_key,
    kovan: etherscan_kovan_api_key,
  };

  const verifier = new ContractVerifier(
    verification,
    multiProvider,
    apiKeys,
    flattenedSource,
    compilerOptions,
  );

  return verifier.verify();
}

main()
  .then(() => console.info('Verification complete'))
  .catch(console.error);

// run with `yarn ts-node src/scripts/token/verify.ts`
