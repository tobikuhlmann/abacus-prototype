import { ethers } from 'ethers';
import { RouterConfig } from "@abacus-network/sdk";

export type MentoPrototypeTokenConfig = {
    name: string;
    symbol: string;
    totalSupply: ethers.BigNumberish;
};

export type MentoPrototypeTokenRouterConfig = RouterConfig & MentoPrototypeTokenConfig
