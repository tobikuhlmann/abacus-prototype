import {
  AbacusCore,
  ChainMap,
  ChainNameToDomainId,
  MultiProvider,
} from '@abacus-network/sdk';
import { expect } from 'chai';
import {
  getConfigMap,
  HelloWorldConfig,
  mentoTestnet2Configs,
  signers_addresses,
} from '../deploy/config_remote_testnets';
import { HelloWorldDeployer } from '../deploy/deploy';
import { HelloWorld } from '../types';

describe('HelloWorld', async () => {
  const localChain = 'alfajores';
  const remoteChain = 'kovan';
  const localDomain = ChainNameToDomainId[localChain];
  const remoteDomain = ChainNameToDomainId[remoteChain];

  type MentoRemoteTestChainNames = 'kovan' | 'alfajores';
  let local: HelloWorld;
  let remote: HelloWorld;
  let core: AbacusCore<MentoRemoteTestChainNames>;
  let multiProvider: MultiProvider<MentoRemoteTestChainNames>;
  let config: ChainMap<MentoRemoteTestChainNames, HelloWorldConfig>;

  before(async () => {
    multiProvider = new MultiProvider(mentoTestnet2Configs);
    core = AbacusCore.fromEnvironment('mento_testnet2', multiProvider);
    config = core.extendWithConnectionClientConfig(
      getConfigMap(signers_addresses),
    );
  });

  before(async () => {
    const helloWorld = new HelloWorldDeployer(multiProvider, config, core);
    const contracts = await helloWorld.deploy();

    console.log('---contracts---')
    console.log(localChain + ': ' + contracts[localChain].router.address);
    console.log(remoteChain + ': ' + contracts[remoteChain].router.address);
    console.log('------')

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

  it('receives a message', async () => {
    // Give Abacus time to relay message
    await new Promise(f => setTimeout(f, 20000));
    // The counts are correct
    expect(await remote.sent()).to.equal(0);
    expect(await remote.received()).to.equal(1);
    expect(await remote.receivedFrom(localDomain)).to.equal(1);
  });
});
