"use strict";

// To modify this file, you must update ./admin/cmds/update-exports.js

import * as ddamers from "./ddamers";

try {
    const anyGlobal = (window as any);

    if (anyGlobal._ddamers == null) {
        anyGlobal._ddamers = ddamers;
    }
} catch (error) { }

export { ddamers };

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
} from "./ddamers";
