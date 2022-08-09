import { RouterConfig } from '@abacus-network/sdk';

export type MentoCrossChainReserveConfig = {
  mentoPrototypeTokenAddress: string;
};

export type MentoCrossChainReserveRouterConfig = RouterConfig &
  MentoCrossChainReserveConfig;
