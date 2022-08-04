import { RouterContracts, RouterFactories } from '@abacus-network/sdk';
import { MentoPrototypeToken, MentoPrototypeToken__factory } from '../../types';

export type MentoPrototypeTokenFactories = RouterFactories<MentoPrototypeToken>;

export const mentoPrototypeTokenFactories: MentoPrototypeTokenFactories = {
  router: new MentoPrototypeToken__factory(),
};

export type MentoPrototypeTokenContracts = RouterContracts<MentoPrototypeToken>;
