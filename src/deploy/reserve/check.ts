import { ChainName, AbacusRouterChecker } from '@abacus-network/sdk';
import { HelloWorldApp } from '../../app/reserve/app';
import { HelloWorldContracts } from '../../app/reserve/contracts';
import { HelloWorldConfig } from './types';

export class HelloWorldChecker<
  Chain extends ChainName,
> extends AbacusRouterChecker<
  Chain,
  HelloWorldApp<Chain>,
  HelloWorldConfig,
  HelloWorldContracts
> {}
