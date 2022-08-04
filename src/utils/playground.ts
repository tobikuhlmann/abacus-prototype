import '@nomiclabs/hardhat-ethers';
//import { ethers as hardhatEthers} from 'hardhat';
//import { ethers as ethersEthers } from 'ethers'
import { ChainNameToDomainId } from '@abacus-network/sdk';

async function main() {
  console.log(ChainNameToDomainId.test1);
  console.log(ChainNameToDomainId['test1']);
}

main()
  .then(() => console.info('playground script executed'))
  .catch(console.error);
