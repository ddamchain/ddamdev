"use strict";

import { Contract, ContractFactory } from "@ddamdev/contracts";

import { BigNumber, FixedNumber } from "@ethersproject/bignumber";

import * as constants from "@ethersproject/constants";

import * as utils from "./utils";

import { ErrorCode as errors, Logger } from "@ethersproject/logger";

////////////////////////
// Types

import { BigNumberish } from "@ethersproject/bignumber";
import { Bytes, BytesLike } from "@ethersproject/bytes";

////////////////////////
// Compile-Time Constants

// This is generated by "npm run dist"
import { version } from "./_version";

const logger = new Logger(version);

////////////////////////
// Types

import {
    ContractFunction,
    ContractReceipt,
    ContractTransaction,

    Event,
    EventFilter,

    Overrides,
    PayableOverrides,
    CallOverrides,

    ContractInterface
} from "@ddamdev/contracts";


////////////////////////
// Exports

export {
    Contract,
    ContractFactory,

    BigNumber,
    FixedNumber,

    constants,
    errors,

    logger,

    utils,


    ////////////////////////
    // Compile-Time Constants

    version,


    ////////////////////////
    // Types

    ContractFunction,
    ContractReceipt,
    ContractTransaction,
    Event,
    EventFilter,

    Overrides,
    PayableOverrides,
    CallOverrides,

    ContractInterface,

    BigNumberish,

    Bytes,
    BytesLike,
};

