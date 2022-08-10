import {ethers as ethersEthers} from "ethers";
import verificationJson from "../../constants/reserve/remote_test_verification.json";
import {writeFileSync} from "fs";
import { ChainMap } from "@abacus-network/sdk";
import { MentoCrossChainReserveContracts } from "../../app/reserve/contracts";
import {MentoCrossChainReserveRouterConfig} from "../../deploy/reserve/types";

export function exportConstructorArguments(
   reserveConfig: ChainMap<"alfajores" | "kovan",  MentoCrossChainReserveRouterConfig>,
   reserveChainToContracts: ChainMap<"alfajores" | "kovan", MentoCrossChainReserveContracts>,
): void {
    const types = ["address",
        "address",
        "address"];
    const values_alfajores = [reserveConfig.alfajores.mentoPrototypeTokenAddress,
        reserveConfig.alfajores.abacusConnectionManager,
        reserveConfig.alfajores.interchainGasPaymaster];
    const alfajores_constructor_arguments = ethersEthers.utils.defaultAbiCoder.encode(types, values_alfajores)

    const values_kovan = [reserveConfig.kovan.mentoPrototypeTokenAddress,
        reserveConfig.kovan.abacusConnectionManager,
        reserveConfig.kovan.interchainGasPaymaster];
    const kovan_constructor_arguments = ethersEthers.utils.defaultAbiCoder.encode(types, values_kovan)

    verificationJson.alfajores[0].name = "MentoCrossChainReserve"
    verificationJson.alfajores[0].address = reserveChainToContracts.alfajores.router.address
    verificationJson.alfajores[0].constructorArguments = alfajores_constructor_arguments
    verificationJson.kovan[0].name = "MentoCrossChainReserve"
    verificationJson.kovan[0].address = reserveChainToContracts.kovan.router.address
    verificationJson.kovan[0].constructorArguments = kovan_constructor_arguments
    writeFileSync('./src/constants/reserve/remote_test_verification.json', JSON.stringify(verificationJson));
}

