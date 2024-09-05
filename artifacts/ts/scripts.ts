/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  ExecutableScript,
  ExecuteScriptParams,
  ExecuteScriptResult,
  Script,
  SignerProvider,
  HexString,
} from "@alephium/web3";
import { getContractByCodeHash } from "./contracts";
import { default as WithdrawScriptJson } from "../Withdraw.ral.json";

export const Withdraw = new ExecutableScript<{
  token: HexString;
  amount: bigint;
}>(Script.fromJson(WithdrawScriptJson, "", []), getContractByCodeHash);
