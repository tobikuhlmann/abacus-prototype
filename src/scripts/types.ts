// from https://github.com/abacus-network/abacus-monorepo/blob/main/typescript/sdk/src/deploy/verify/types.ts
import {ChainMap} from "@abacus-network/sdk";

export type CompilerOptions = {
    codeformat: 'solidity-single-file' | 'solidity-standard-json-input'; //solidity-single-file (default) or solidity-standard-json-input (for std-input-json-format support
    compilerversion: string; // see https://etherscan.io/solcversions for list of support versions
    optimizationUsed: '0' | '1'; //0 = No Optimization, 1 = Optimization used (applicable when codeformat=solidity-single-file)
    runs: string; //set to 200 as default unless otherwise  (applicable when codeformat=solidity-single-file)
};

export type MentoRemoteTestChainNames = 'kovan' | 'alfajores';

export type MentoChainMap = ChainMap<MentoRemoteTestChainNames, string>