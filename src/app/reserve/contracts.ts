import { RouterContracts, RouterFactories } from '@abacus-network/sdk';
import {
  MentoCrossChainReserve,
  MentoCrossChainReserve__factory,
} from '../../types';

export type MentoCrossChainReserveFactories =
  RouterFactories<MentoCrossChainReserve>;

export const mentoCrossChainReserveFactories: MentoCrossChainReserveFactories =
  {
    router: new MentoCrossChainReserve__factory(),
  };

export type MentoCrossChainReserveContracts =
  RouterContracts<MentoCrossChainReserve>;
