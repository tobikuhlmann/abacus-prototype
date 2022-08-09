import { ChainName, AbacusRouterChecker } from '@abacus-network/sdk';
import { HelloWorldApp } from '../../app/helloworld/app';
import { HelloWorldContracts } from '../../app/helloworld/contracts';
import { HelloWorldConfig } from './types';

export class HelloWorldChecker<
  Chain extends ChainName,
> extends AbacusRouterChecker<
  Chain,
  HelloWorldApp<Chain>,
  HelloWorldConfig,
  HelloWorldContracts
> {}
