import {
  ChainMap,
  ChainNameToDomainId,
  getTestMultiProvider,
  MultiProvider,
  testChainConnectionConfigs,
  TestChainNames,
  TestCoreApp,
  TestCoreDeployer,
} from '@abacus-network/sdk';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { getConfigMap } from '../../deploy/helloworld/config_local_testnets';
import { HelloWorldConfig } from '../../deploy/helloworld/types';
import { HelloWorldDeployer } from '../../deploy/helloworld/deploy';
import { HelloWorld } from '../../types';

describe('HelloWorld', async () => {
  const localChain = 'test1';
  const remoteChain = 'test2';
  const localDomain = ChainNameToDomainId[localChain];
  const remoteDomain = ChainNameToDomainId[remoteChain];

  let signer: SignerWithAddress;
  let local: HelloWorld;
  let remote: HelloWorld;
  let multiProvider: MultiProvider<TestChainNames>;
  let coreApp: TestCoreApp;
  let config: ChainMap<TestChainNames, HelloWorldConfig>;

  before(async () => {
    [signer] = await ethers.getSigners();

    multiProvider = getTestMultiProvider(signer, testChainConnectionConfigs);

    const coreDeployer = new TestCoreDeployer(multiProvider);
    const coreContractsMaps = await coreDeployer.deploy();
    coreApp = new TestCoreApp(coreContractsMaps, multiProvider);
    config = coreApp.extendWithConnectionClientConfig(
      getConfigMap(signer.address),
    );
  });

  beforeEach(async () => {
    const helloWorld = new HelloWorldDeployer(multiProvider, config, coreApp);
    const contracts = await helloWorld.deploy();

    local = contracts[localChain].router;
    remote = contracts[remoteChain].router;

    // The all counts start empty
    expect(await local.sent()).to.equal(0);
    expect(await local.received()).to.equal(0);
    expect(await remote.sent()).to.equal(0);
    expect(await remote.received()).to.equal(0);
  });

  it('sends a message', async () => {
    await expect(local.sendHelloWorld(remoteDomain, 'Hello')).to.emit(
      local,
      'SentHelloWorld',
    );
    // The sent counts are correct
    expect(await local.sent()).to.equal(1);
    expect(await local.sentTo(remoteDomain)).to.equal(1);
    // The received counts are correct
    expect(await local.received()).to.equal(0);
  });

  it('handles a message', async () => {
    await local.sendHelloWorld(remoteDomain, 'World');
    // Mock processing of the message by Abacus
    await coreApp.processOutboundMessages(localChain);
    // The initial message has been dispatched.
    expect(await local.sent()).to.equal(1);
    // The initial message has been processed.
    expect(await remote.received()).to.equal(1);
    expect(await remote.receivedFrom(localDomain)).to.equal(1);
  });
});
