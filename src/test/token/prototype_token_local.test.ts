import {
  AbacusCore,
  getTestMultiProvider,
  MultiProvider,
  testChainConnectionConfigs,
  TestChainNames,
  TestCoreApp,
  TestCoreDeployer,
  ChainMap,
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
import { expect, assert } from 'chai';
import { MentoPrototypeToken } from '../../types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('MentoPrototypeToken', async () => {
  let signer, recipient: SignerWithAddress;
  let multiProvider: MultiProvider<TestChainNames>;
  let core: AbacusCore<TestChainNames>;
  let config: ChainMap<TestChainNames, MentoPrototypeTokenRouterConfig>;
  let deployer: MentoPrototypeTokenDeployer<TestChainNames>;
  let coreDeployer: TestCoreDeployer;
  let coreApp: TestCoreApp;
  let contracts: ChainMap<TestChainNames, MentoPrototypeTokenContracts>;
  let transferAmount: number;
  const testInterchainGasPayment = 1000000000;

  before(async () => {
    [signer, recipient] = await hardhatEthers.getSigners();
    multiProvider = getTestMultiProvider(signer, testChainConnectionConfigs);
    coreDeployer = new TestCoreDeployer(multiProvider);
    const coreContractsMaps = await coreDeployer.deploy();
    coreApp = new TestCoreApp(coreContractsMaps, multiProvider);
    const connection_config = coreApp.extendWithConnectionClientConfig(
      getConfigMap(signer.address),
    );
    config = extendWithTokenConfig(connection_config, tokenConfig);

    transferAmount = 1000;
  });

  beforeEach(async () => {
    deployer = new MentoPrototypeTokenDeployer(multiProvider, config, core);
    contracts = await deployer.deploy();
  });

  const expectBalance = async (
    token: MentoPrototypeToken,
    signer: ethersEthers.Signer,
    balance: number,
  ) => expect(await token.balanceOf(await signer.getAddress())).to.eq(balance);

  it('should be correct type', async () => {
    assert.typeOf(contracts, typeof contracts);
  });

  it('should not be initializable again', async () => {
    await expect(
      contracts.test1.router.initialize(
        config.test1.abacusConnectionManager,
        config.test1.interchainGasPaymaster,
        config.test1.totalSupply,
        config.test1.name,
        config.test1.symbol,
      ),
    ).to.be.revertedWith('Initializable: contract is already initialized');
  });

  it('should mint total supply to deployer', async () => {
    await expectBalance(contracts.test1.router, recipient, 0);
    await expectBalance(
      contracts.test1.router,
      signer,
      +config.test1.totalSupply.toString(),
    );
    await expectBalance(contracts.test2.router, recipient, 0);
    await expectBalance(
      contracts.test2.router,
      signer,
      +config.test2.totalSupply.toString(),
    );
  });

  it('should allow for local transfers', async () => {
    await contracts.test1.router.transfer(recipient.address, transferAmount);
    await expectBalance(contracts.test1.router, recipient, transferAmount);
    await expectBalance(
      contracts.test1.router,
      signer,
      +config.test2.totalSupply.toString() - transferAmount,
    );
    await expectBalance(contracts.test2.router, recipient, 0);
    await expectBalance(
      contracts.test2.router,
      signer,
      +config.test2.totalSupply.toString(),
    );
  });

  it('should allow for remote transfers', async () => {
    await contracts.test1.router.transferRemote(
      ChainNameToDomainId['test2'],
      recipient.address,
      transferAmount,
    );

    await expectBalance(contracts.test1.router, recipient, 0);
    await expectBalance(
      contracts.test1.router,
      signer,
      +config.test1.totalSupply.toString() - transferAmount,
    );
    await expectBalance(contracts.test2.router, recipient, 0);
    await expectBalance(
      contracts.test2.router,
      signer,
      +config.test2.totalSupply.toString(),
    );

    await coreApp.processOutboundMessages('test1');

    await expectBalance(contracts.test1.router, recipient, 0);
    await expectBalance(
      contracts.test1.router,
      signer,
      +config.test1.totalSupply.toString() - transferAmount,
    );
    await expectBalance(contracts.test2.router, recipient, transferAmount);
    await expectBalance(
      contracts.test2.router,
      signer,
      +config.test2.totalSupply.toString(),
    );
  });

  it('allows interchain gas payment for remote transfers', async () => {
    await contracts.test1.router.transferRemote(
      ChainNameToDomainId['test2'],
      recipient.address,
      transferAmount,
      { value: testInterchainGasPayment },
    );

    await expectBalance(contracts.test1.router, recipient, 0);
    await expectBalance(
      contracts.test1.router,
      signer,
      +config.test1.totalSupply.toString() - transferAmount,
    );
    await expectBalance(contracts.test2.router, recipient, 0);
    await expectBalance(
      contracts.test2.router,
      signer,
      +config.test2.totalSupply.toString(),
    );

    await coreApp.processOutboundMessages('test1');

    await expectBalance(contracts.test1.router, recipient, 0);
    await expectBalance(
      contracts.test1.router,
      signer,
      +config.test1.totalSupply.toString() - transferAmount,
    );
    await expectBalance(contracts.test2.router, recipient, transferAmount);
    await expectBalance(
      contracts.test2.router,
      signer,
      +config.test2.totalSupply.toString(),
    );
  });

  it('should emit TransferRemote events', async () => {
    void expect(
      await contracts.test1.router.transferRemote(
        ChainNameToDomainId['test2'],
        recipient.address,
        transferAmount,
      ),
    )
      .to.emit(contracts.test1.router, 'SentTransferRemote')
      .withArgs(
        ChainNameToDomainId['test2'],
        recipient.address,
        transferAmount,
      );
    void expect(await coreApp.processOutboundMessages('test1'))
      .to.emit(contracts.test1.router, 'ReceivedTransferRemote')
      .withArgs(
        ChainNameToDomainId['test1'],
        recipient.address,
        transferAmount,
      );
  });
});
