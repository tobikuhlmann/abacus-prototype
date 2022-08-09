import {
  AbacusCore,
  getTestMultiProvider,
  MultiProvider,
  testChainConnectionConfigs,
  TestChainNames,
  TestCoreApp,
  TestCoreDeployer,
  ChainMap,
  serializeContracts,
  ChainNameToDomainId,
} from '@abacus-network/sdk';
import '@nomiclabs/hardhat-waffle';
import { ethers as hardhatEthers } from 'hardhat';
import { ethers as ethersEthers } from 'ethers';
import { MentoPrototypeTokenRouterConfig } from '../../deploy/token/types';
import { MentoPrototypeTokenDeployer } from '../../deploy/token/deploy';
import { MentoPrototypeTokenContracts } from '../../app/token/contracts';
import { getConfigMap } from '../../deploy/helloworld/config_local_testnets';
import {
  extendWithTokenConfig,
  tokenConfig,
} from '../../deploy/token/config_local_testnets';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getReserveConfigMap } from '../../deploy/reserve/config_local_testnets';
import { MentoCrossChainReserveDeployer } from '../../deploy/reserve/deploy';
import { MentoCrossChainReserveRouterConfig } from '../../deploy/reserve/types';
import { MentoCrossChainReserveContracts } from '../../app/reserve/contracts';
import { MentoPrototypeToken } from '../../types';

describe('MentoPrototypeToken', async () => {
  let signer, recipient: SignerWithAddress;
  let multiProvider: MultiProvider<TestChainNames>;
  let core: AbacusCore<TestChainNames>;
  let coreDeployer: TestCoreDeployer;
  let coreApp: TestCoreApp;
  let tokenDeployerConfig: ChainMap<
    TestChainNames,
    MentoPrototypeTokenRouterConfig
  >;
  let tokenDeployer: MentoPrototypeTokenDeployer<TestChainNames>;
  let tokenContracts: ChainMap<TestChainNames, MentoPrototypeTokenContracts>;
  let reserveDeployerConfig: ChainMap<
    TestChainNames,
    MentoCrossChainReserveRouterConfig
  >;
  let reserveDeployer: MentoCrossChainReserveDeployer<TestChainNames>;
  let reserveContracts: ChainMap<
    TestChainNames,
    MentoCrossChainReserveContracts
  >;

  const initialReserveBalance = ethersEthers.BigNumber.from('10000');
  const rebalanceAmount = ethersEthers.BigNumber.from('1000');
  const testInterchainGasPayment = 10000000;

  before(async () => {
    [signer, recipient] = await hardhatEthers.getSigners();
    multiProvider = getTestMultiProvider(signer, testChainConnectionConfigs);
    coreDeployer = new TestCoreDeployer(multiProvider);
    const coreContractsMaps = await coreDeployer.deploy();
    coreApp = new TestCoreApp(coreContractsMaps, multiProvider);
    const connection_config = coreApp.extendWithConnectionClientConfig(
      getConfigMap(signer.address),
    );
    tokenDeployerConfig = extendWithTokenConfig(connection_config, tokenConfig);
  });

  beforeEach(async () => {
    tokenDeployer = new MentoPrototypeTokenDeployer(
      multiProvider,
      tokenDeployerConfig,
      core,
    );
    tokenContracts = await tokenDeployer.deploy();
    const tokenAddresses = serializeContracts(tokenContracts);
    reserveDeployerConfig = coreApp.extendWithConnectionClientConfig(
      getReserveConfigMap(signer.address, tokenAddresses),
    );
    reserveDeployer = new MentoCrossChainReserveDeployer(
      multiProvider,
      reserveDeployerConfig,
      core,
    );
    reserveContracts = await reserveDeployer.deploy();

    // send some prototype token to reserve contracts
    await tokenContracts.test1.router.transfer(
      reserveContracts.test1.router.address,
      initialReserveBalance,
    );
    await tokenContracts.test2.router.transfer(
      reserveContracts.test2.router.address,
      initialReserveBalance,
    );
  });

  const expectBalance = async (
    token: MentoPrototypeToken,
    address: string,
    balance: number,
  ) => expect(await token.balanceOf(address)).to.eq(balance);

  it('balances after transfer should be as expected', async () => {
    await expectBalance(
      tokenContracts.test1.router,
      signer.address,
      tokenDeployerConfig.test1.totalSupply
        .sub(initialReserveBalance)
        .toNumber(),
    );
    await expectBalance(
      tokenContracts.test2.router,
      signer.address,
      tokenDeployerConfig.test2.totalSupply
        .sub(initialReserveBalance)
        .toNumber(),
    );
    await expectBalance(
      tokenContracts.test1.router,
      reserveContracts.test1.router.address,
      initialReserveBalance.toNumber(),
    );
    await expectBalance(
      tokenContracts.test2.router,
      reserveContracts.test2.router.address,
      initialReserveBalance.toNumber(),
    );
    await expectBalance(tokenContracts.test1.router, recipient.address, 0);
    await expectBalance(tokenContracts.test2.router, recipient.address, 0);
  });

  it('should allow for remote rabalancings', async () => {
    await reserveContracts.test1.router.rebalanceRemote(
      ChainNameToDomainId['test2'],
      reserveContracts.test2.router.address,
      rebalanceAmount,
    );
    await expectBalance(
      tokenContracts.test1.router,
      reserveContracts.test1.router.address,
      initialReserveBalance.sub(rebalanceAmount).toNumber(),
    );
    await expectBalance(
      tokenContracts.test2.router,
      reserveContracts.test2.router.address,
      initialReserveBalance.toNumber(),
    );

    await coreApp.processOutboundMessages('test1');

    await expectBalance(
      tokenContracts.test1.router,
      reserveContracts.test1.router.address,
      initialReserveBalance.sub(rebalanceAmount).toNumber(),
    );
    await expectBalance(
      tokenContracts.test2.router,
      reserveContracts.test2.router.address,
      initialReserveBalance.add(rebalanceAmount).toNumber(),
    );
  });

  it('allows interchain gas payment for remote rebalancing', async () => {
    await reserveContracts.test1.router.rebalanceRemote(
      ChainNameToDomainId['test2'],
      reserveContracts.test2.router.address,
      rebalanceAmount,
      { value: testInterchainGasPayment },
    );
    await expectBalance(
      tokenContracts.test1.router,
      reserveContracts.test1.router.address,
      initialReserveBalance.sub(rebalanceAmount).toNumber(),
    );
    await expectBalance(
      tokenContracts.test2.router,
      reserveContracts.test2.router.address,
      initialReserveBalance.toNumber(),
    );

    await coreApp.processOutboundMessages('test1');

    await expectBalance(
      tokenContracts.test1.router,
      reserveContracts.test1.router.address,
      initialReserveBalance.sub(rebalanceAmount).toNumber(),
    );
    await expectBalance(
      tokenContracts.test2.router,
      reserveContracts.test2.router.address,
      initialReserveBalance.add(rebalanceAmount).toNumber(),
    );
  });
});
