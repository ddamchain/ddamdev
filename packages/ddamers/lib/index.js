"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// To modify this file, you must update ./admin/cmds/update-exports.js
var ddamers = __importStar(require("./ddamers"));
exports.ddamers = ddamers;
try {
    var anyGlobal = window;
    if (anyGlobal._ddamers == null) {
        anyGlobal._ddamers = ddamers;
    }
}
catch (error) { }
var ddamers_1 = require("./ddamers");
exports.Contract = ddamers_1.Contract;
exports.ContractFactory = ddamers_1.ContractFactory;
exports.BigNumber = ddamers_1.BigNumber;
exports.FixedNumber = ddamers_1.FixedNumber;
exports.constants = ddamers_1.constants;
exports.errors = ddamers_1.errors;
exports.logger = ddamers_1.logger;
exports.utils = ddamers_1.utils;
////////////////////////
// Compile-Time Constants
exports.version = ddamers_1.version;
