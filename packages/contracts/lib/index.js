"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var abi_1 = require("@ddamdev/abi");
var abstract_provider_1 = require("@ethersproject/abstract-provider");
var abstract_signer_1 = require("@ethersproject/abstract-signer");
var address_1 = require("@ddamdev/address");
var bignumber_1 = require("@ethersproject/bignumber");
var bytes_1 = require("@ethersproject/bytes");
var constants_1 = require("@ethersproject/constants");
var properties_1 = require("@ethersproject/properties");
var logger_1 = require("@ethersproject/logger");
var _version_1 = require("./_version");
var logger = new logger_1.Logger(_version_1.version);
///////////////////////////////
var allowedTransactionKeys = {
    chainId: true, data: true, from: true, gasLimit: true, gasPrice: true, nonce: true, to: true, value: true
};
// Recursively replaces ENS names with promises to resolve the name and resolves all properties
function resolveAddresses(signerOrProvider, value, paramType) {
    if (Array.isArray(paramType)) {
        return Promise.all(paramType.map(function (paramType, index) {
            return resolveAddresses(signerOrProvider, ((Array.isArray(value)) ? value[index] : value[paramType.name]), paramType);
        }));
    }
    if (paramType.type === "address") {
        return signerOrProvider.resolveName(value);
    }
    if (paramType.type === "tuple") {
        return resolveAddresses(signerOrProvider, value, paramType.components);
    }
    if (paramType.baseType === "array") {
        if (!Array.isArray(value)) {
            throw new Error("invalid value for array");
        }
        return Promise.all(value.map(function (v) { return resolveAddresses(signerOrProvider, v, paramType.arrayChildren); }));
    }
    return Promise.resolve(value);
}
/*
export function _populateTransaction(func: FunctionFragment, args: Array<any>, overrides?: any): Promise<Transaction> {
    return null;
}

export function _sendTransaction(func: FunctionFragment, args: Array<any>, overrides?: any): Promise<Transaction> {
    return null;
}
*/
function runMethod(contract, functionName, options) {
    var method = contract.interface.functions[functionName];
    return function () {
        var _this = this;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var tx = {};
        var blockTag = null;
        // If 1 extra parameter was passed in, it contains overrides
        if (params.length === method.inputs.length + 1 && typeof (params[params.length - 1]) === "object") {
            tx = properties_1.shallowCopy(params.pop());
            if (tx.blockTag != null) {
                blockTag = tx.blockTag;
            }
            delete tx.blockTag;
            // Check for unexpected keys (e.g. using "gas" instead of "gasLimit")
            for (var key in tx) {
                if (!allowedTransactionKeys[key]) {
                    logger.throwArgumentError(("unknown transaction override - " + key), "overrides", tx);
                }
            }
        }
        logger.checkArgumentCount(params.length, method.inputs.length, "passed to contract");
        // Check overrides make sense
        ["data", "to"].forEach(function (key) {
            if (tx[key] != null) {
                logger.throwError("cannot override " + key, logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: key });
            }
        });
        // If the contract was just deployed, wait until it is minded
        if (contract.deployTransaction != null) {
            tx.to = contract._deployed(blockTag).then(function () {
                return contract.resolvedAddress;
            });
        }
        else {
            tx.to = contract.resolvedAddress;
        }
        return resolveAddresses(contract.signer || contract.provider, params, method.inputs).then(function (params) {
            tx.data = contract.interface.encodeFunctionData(method, params);
            if (method.constant || options.callStatic) {
                // Call (constant functions) always cost 0 ether
                if (options.estimate) {
                    return Promise.resolve(constants_1.Zero);
                }
                if (!contract.provider && !contract.signer) {
                    logger.throwError("call (constant functions) require a provider or signer", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: "call" });
                }
                // Check overrides make sense
                ["gasLimit", "gasPrice", "value"].forEach(function (key) {
                    if (tx[key] != null) {
                        throw new Error("call cannot override " + key);
                    }
                });
                if (options.transaction) {
                    return properties_1.resolveProperties(tx);
                }
                return (contract.signer || contract.provider).call(tx, blockTag).then(function (value) {
                    try {
                        var result = contract.interface.decodeFunctionResult(method, value);
                        if (method.outputs.length === 1) {
                            result = result[0];
                        }
                        return result;
                    }
                    catch (error) {
                        if (error.code === logger_1.Logger.errors.CALL_EXCEPTION) {
                            error.address = contract.address;
                            error.args = params;
                            error.transaction = tx;
                        }
                        throw error;
                    }
                });
            }
            // Only computing the transaction estimate
            if (options.estimate) {
                if (!contract.provider && !contract.signer) {
                    logger.throwError("estimate require a provider or signer", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: "estimateGas" });
                }
                return (contract.signer || contract.provider).estimateGas(tx);
            }
            if (tx.gasLimit == null && method.gas != null) {
                tx.gasLimit = bignumber_1.BigNumber.from(method.gas).add(21000);
            }
            if (tx.value != null && !method.payable) {
                logger.throwArgumentError("contract method is not payable", "sendTransaction:" + method.format(), tx);
            }
            if (options.transaction) {
                return properties_1.resolveProperties(tx);
            }
            if (!contract.signer) {
                logger.throwError("sending a transaction requires a signer", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: "sendTransaction" });
            }
            return contract.signer.sendTransaction(tx).then(function (tx) {
                var wait = tx.wait.bind(tx);
                tx.wait = function (confirmations) {
                    return wait(confirmations).then(function (receipt) {
                        receipt.events = receipt.logs.map(function (log) {
                            var event = properties_1.deepCopy(log);
                            var parsed = null;
                            try {
                                parsed = contract.interface.parseLog(log);
                            }
                            catch (e) { }
                            if (parsed) {
                                event.args = parsed.args;
                                event.decode = function (data, topics) {
                                    return _this.interface.decodeEventLog(parsed.eventFragment, data, topics);
                                };
                                event.event = parsed.name;
                                event.eventSignature = parsed.signature;
                            }
                            event.removeListener = function () { return contract.provider; };
                            event.getBlock = function () {
                                return contract.provider.getBlock(receipt.blockHash);
                            };
                            event.getTransaction = function () {
                                return contract.provider.getTransaction(receipt.transactionHash);
                            };
                            event.getTransactionReceipt = function () {
                                return Promise.resolve(receipt);
                            };
                            return event;
                        });
                        return receipt;
                    });
                };
                return tx;
            });
        });
    };
}
function getEventTag(filter) {
    if (filter.address && (filter.topics == null || filter.topics.length === 0)) {
        return "*";
    }
    return (filter.address || "*") + "@" + (filter.topics ? filter.topics.join(":") : "");
}
var RunningEvent = /** @class */ (function () {
    function RunningEvent(tag, filter) {
        properties_1.defineReadOnly(this, "tag", tag);
        properties_1.defineReadOnly(this, "filter", filter);
        this._listeners = [];
    }
    RunningEvent.prototype.addListener = function (listener, once) {
        this._listeners.push({ listener: listener, once: once });
    };
    RunningEvent.prototype.removeListener = function (listener) {
        var done = false;
        this._listeners = this._listeners.filter(function (item) {
            if (done || item.listener !== listener) {
                return true;
            }
            done = true;
            return false;
        });
    };
    RunningEvent.prototype.removeAllListeners = function () {
        this._listeners = [];
    };
    RunningEvent.prototype.listeners = function () {
        return this._listeners.map(function (i) { return i.listener; });
    };
    RunningEvent.prototype.listenerCount = function () {
        return this._listeners.length;
    };
    RunningEvent.prototype.run = function (args) {
        var _this = this;
        var listenerCount = this.listenerCount();
        this._listeners = this._listeners.filter(function (item) {
            var argsCopy = args.slice();
            // Call the callback in the next event loop
            setTimeout(function () {
                item.listener.apply(_this, argsCopy);
            }, 0);
            // Reschedule it if it not "once"
            return !(item.once);
        });
        return listenerCount;
    };
    RunningEvent.prototype.prepareEvent = function (event) {
    };
    // Returns the array that will be applied to an emit
    RunningEvent.prototype.getEmit = function (event) {
        return [event];
    };
    return RunningEvent;
}());
var ErrorRunningEvent = /** @class */ (function (_super) {
    __extends(ErrorRunningEvent, _super);
    function ErrorRunningEvent() {
        return _super.call(this, "error", null) || this;
    }
    return ErrorRunningEvent;
}(RunningEvent));
// @TODO Fragment should inherit Wildcard? and just override getEmit?
//       or have a common abstract super class, with enough constructor
//       options to configure both.
// A Fragment Event will populate all the properties that Wildcard
// will, and additioanlly dereference the arguments when emitting
var FragmentRunningEvent = /** @class */ (function (_super) {
    __extends(FragmentRunningEvent, _super);
    function FragmentRunningEvent(address, contractInterface, fragment, topics) {
        var _this = this;
        var filter = {
            address: address
        };
        var topic = contractInterface.getEventTopic(fragment);
        if (topics) {
            if (topic !== topics[0]) {
                logger.throwArgumentError("topic mismatch", "topics", topics);
            }
            filter.topics = topics.slice();
        }
        else {
            filter.topics = [topic];
        }
        _this = _super.call(this, getEventTag(filter), filter) || this;
        properties_1.defineReadOnly(_this, "address", address);
        properties_1.defineReadOnly(_this, "interface", contractInterface);
        properties_1.defineReadOnly(_this, "fragment", fragment);
        return _this;
    }
    FragmentRunningEvent.prototype.prepareEvent = function (event) {
        var _this = this;
        _super.prototype.prepareEvent.call(this, event);
        event.event = this.fragment.name;
        event.eventSignature = this.fragment.format();
        event.decode = function (data, topics) {
            return _this.interface.decodeEventLog(_this.fragment, data, topics);
        };
        try {
            event.args = this.interface.decodeEventLog(this.fragment, event.data, event.topics);
        }
        catch (error) {
            event.args = null;
            event.decodeError = error;
        }
    };
    FragmentRunningEvent.prototype.getEmit = function (event) {
        var errors = abi_1.checkResultErrors(event.args);
        if (errors.length) {
            throw errors[0].error;
        }
        var args = (event.args || []).slice();
        args.push(event);
        return args;
    };
    return FragmentRunningEvent;
}(RunningEvent));
// A Wildard Event will attempt to populate:
//  - event            The name of the event name
//  - eventSignature   The full signature of the event
//  - decode           A function to decode data and topics
//  - args             The decoded data and topics
var WildcardRunningEvent = /** @class */ (function (_super) {
    __extends(WildcardRunningEvent, _super);
    function WildcardRunningEvent(address, contractInterface) {
        var _this = _super.call(this, "*", { address: address }) || this;
        properties_1.defineReadOnly(_this, "address", address);
        properties_1.defineReadOnly(_this, "interface", contractInterface);
        return _this;
    }
    WildcardRunningEvent.prototype.prepareEvent = function (event) {
        var _this = this;
        _super.prototype.prepareEvent.call(this, event);
        try {
            var parsed_1 = this.interface.parseLog(event);
            event.event = parsed_1.name;
            event.eventSignature = parsed_1.signature;
            event.decode = function (data, topics) {
                return _this.interface.decodeEventLog(parsed_1.eventFragment, data, topics);
            };
            event.args = parsed_1.args;
        }
        catch (error) {
            // No matching event
        }
    };
    return WildcardRunningEvent;
}(RunningEvent));
var Contract = /** @class */ (function () {
    function Contract(addressOrName, contractInterface, signerOrProvider) {
        var _newTarget = this.constructor;
        var _this = this;
        logger.checkNew(_newTarget, Contract);
        // @TODO: Maybe still check the addressOrName looks like a valid address or name?
        //address = getAddress(address);
        properties_1.defineReadOnly(this, "interface", properties_1.getStatic((_newTarget), "getInterface")(contractInterface));
        if (abstract_signer_1.Signer.isSigner(signerOrProvider)) {
            properties_1.defineReadOnly(this, "provider", signerOrProvider.provider || null);
            properties_1.defineReadOnly(this, "signer", signerOrProvider);
        }
        else if (abstract_provider_1.Provider.isProvider(signerOrProvider)) {
            properties_1.defineReadOnly(this, "provider", signerOrProvider);
            properties_1.defineReadOnly(this, "signer", null);
        }
        else {
            logger.throwArgumentError("invalid signer or provider", "signerOrProvider", signerOrProvider);
        }
        properties_1.defineReadOnly(this, "callStatic", {});
        properties_1.defineReadOnly(this, "estimateGas", {});
        properties_1.defineReadOnly(this, "functions", {});
        properties_1.defineReadOnly(this, "populateTransaction", {});
        properties_1.defineReadOnly(this, "filters", {});
        {
            var uniqueFilters_1 = {};
            Object.keys(this.interface.events).forEach(function (eventSignature) {
                var event = _this.interface.events[eventSignature];
                properties_1.defineReadOnly(_this.filters, eventSignature, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return {
                        address: _this.address,
                        topics: _this.interface.encodeFilterTopics(event, args)
                    };
                });
                if (!uniqueFilters_1[event.name]) {
                    uniqueFilters_1[event.name] = [];
                }
                uniqueFilters_1[event.name].push(eventSignature);
            });
            Object.keys(uniqueFilters_1).forEach(function (name) {
                var filters = uniqueFilters_1[name];
                if (filters.length === 1) {
                    properties_1.defineReadOnly(_this.filters, name, _this.filters[filters[0]]);
                }
                else {
                    logger.warn("Duplicate definition of " + name + " (" + filters.join(", ") + ")");
                }
            });
        }
        properties_1.defineReadOnly(this, "_runningEvents", {});
        properties_1.defineReadOnly(this, "_wrappedEmits", {});
        properties_1.defineReadOnly(this, "address", addressOrName);
        if (this.provider) {
            properties_1.defineReadOnly(this, "resolvedAddress", this.provider.resolveName(addressOrName).then(function (address) {
                if (address == null) {
                    throw new Error("name not found");
                }
                return address;
            }).catch(function (error) {
                console.log("ERROR: Cannot find Contract - " + addressOrName);
                throw error;
            }));
        }
        else {
            try {
                properties_1.defineReadOnly(this, "resolvedAddress", Promise.resolve((this.interface.constructor).getAddress(addressOrName)));
            }
            catch (error) {
                // Without a provider, we cannot use ENS names
                logger.throwArgumentError("provider is required to use non-address contract address", "addressOrName", addressOrName);
            }
        }
        var uniqueNames = {};
        var uniqueSignatures = {};
        Object.keys(this.interface.functions).forEach(function (signature) {
            var fragment = _this.interface.functions[signature];
            // Check that the signature is unique; if not the ABI generation has
            // not been cleaned or may be incorrectly generated
            if (uniqueSignatures[signature]) {
                logger.warn("Duplicate ABI entry for " + JSON.stringify(name));
                return;
            }
            uniqueSignatures[signature] = true;
            // Track unique names; we only expose bare named functions if they
            // are ambiguous
            {
                var name_1 = fragment.name;
                if (!uniqueNames[name_1]) {
                    uniqueNames[name_1] = [];
                }
                uniqueNames[name_1].push(signature);
            }
            // @TODO: This should take in fragment
            var run = runMethod(_this, signature, {});
            if (_this[signature] == null) {
                properties_1.defineReadOnly(_this, signature, run);
            }
            if (_this.functions[signature] == null) {
                properties_1.defineReadOnly(_this.functions, signature, run);
            }
            if (_this.callStatic[signature] == null) {
                properties_1.defineReadOnly(_this.callStatic, signature, runMethod(_this, signature, { callStatic: true }));
            }
            if (_this.populateTransaction[signature] == null) {
                properties_1.defineReadOnly(_this.populateTransaction, signature, runMethod(_this, signature, { transaction: true }));
            }
            if (_this.estimateGas[signature] == null) {
                properties_1.defineReadOnly(_this.estimateGas, signature, runMethod(_this, signature, { estimate: true }));
            }
        });
        Object.keys(uniqueNames).forEach(function (name) {
            // Ambiguous names to not get attached as bare names
            var signatures = uniqueNames[name];
            if (signatures.length > 1) {
                return;
            }
            var signature = signatures[0];
            if (_this[name] == null) {
                properties_1.defineReadOnly(_this, name, _this[signature]);
            }
            if (_this.functions[name] == null) {
                properties_1.defineReadOnly(_this.functions, name, _this.functions[signature]);
            }
            if (_this.callStatic[name] == null) {
                properties_1.defineReadOnly(_this.callStatic, name, _this.callStatic[signature]);
            }
            if (_this.populateTransaction[name] == null) {
                properties_1.defineReadOnly(_this.populateTransaction, name, _this.populateTransaction[signature]);
            }
            if (_this.estimateGas[name] == null) {
                properties_1.defineReadOnly(_this.estimateGas, name, _this.estimateGas[signature]);
            }
        });
    }
    Contract.getContractAddress = function (transaction) {
        return address_1.getContractAddress(transaction);
    };
    Contract.getInterface = function (contractInterface) {
        if (abi_1.Interface.isInterface(contractInterface)) {
            return contractInterface;
        }
        return new abi_1.Interface(contractInterface);
    };
    // @TODO: Allow timeout?
    Contract.prototype.deployed = function () {
        return this._deployed();
    };
    Contract.prototype._deployed = function (blockTag) {
        var _this = this;
        if (!this._deployedPromise) {
            // If we were just deployed, we know the transaction we should occur in
            if (this.deployTransaction) {
                this._deployedPromise = this.deployTransaction.wait().then(function () {
                    return _this;
                });
            }
            else {
                // @TODO: Once we allow a timeout to be passed in, we will wait
                // up to that many blocks for getCode
                // Otherwise, poll for our code to be deployed
                this._deployedPromise = this.provider.getCode(this.address, blockTag).then(function (code) {
                    if (code === "0x") {
                        logger.throwError("contract not deployed", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                            contractAddress: _this.address,
                            operation: "getDeployed"
                        });
                    }
                    return _this;
                });
            }
        }
        return this._deployedPromise;
    };
    // @TODO:
    // estimateFallback(overrides?: TransactionRequest): Promise<BigNumber>
    // @TODO:
    // estimateDeploy(bytecode: string, ...args): Promise<BigNumber>
    Contract.prototype.fallback = function (overrides) {
        var _this = this;
        if (!this.signer) {
            logger.throwError("sending a transactions require a signer", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: "sendTransaction(fallback)" });
        }
        var tx = properties_1.shallowCopy(overrides || {});
        ["from", "to"].forEach(function (key) {
            if (tx[key] == null) {
                return;
            }
            logger.throwError("cannot override " + key, logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: key });
        });
        tx.to = this.resolvedAddress;
        return this.deployed().then(function () {
            return _this.signer.sendTransaction(tx);
        });
    };
    // Reconnect to a different signer or provider
    Contract.prototype.connect = function (signerOrProvider) {
        if (typeof (signerOrProvider) === "string") {
            signerOrProvider = new abstract_signer_1.VoidSigner(signerOrProvider, this.provider);
        }
        var contract = new (this.constructor)(this.address, this.interface, signerOrProvider);
        if (this.deployTransaction) {
            properties_1.defineReadOnly(contract, "deployTransaction", this.deployTransaction);
        }
        return contract;
    };
    // Re-attach to a different on-chain instance of this contract
    Contract.prototype.attach = function (addressOrName) {
        return new (this.constructor)(addressOrName, this.interface, this.signer || this.provider);
    };
    Contract.isIndexed = function (value) {
        return abi_1.Indexed.isIndexed(value);
    };
    Contract.prototype._normalizeRunningEvent = function (runningEvent) {
        // Already have an instance of this event running; we can re-use it
        if (this._runningEvents[runningEvent.tag]) {
            return this._runningEvents[runningEvent.tag];
        }
        return runningEvent;
    };
    Contract.prototype._getRunningEvent = function (eventName) {
        if (typeof (eventName) === "string") {
            // Listen for "error" events (if your contract has an error event, include
            // the full signature to bypass this special event keyword)
            if (eventName === "error") {
                return this._normalizeRunningEvent(new ErrorRunningEvent());
            }
            // Listen for any event that is registered
            if (eventName === "event") {
                return this._normalizeRunningEvent(new RunningEvent("event", null));
            }
            // Listen for any event
            if (eventName === "*") {
                return this._normalizeRunningEvent(new WildcardRunningEvent(this.address, this.interface));
            }
            // Get the event Fragment (throws if ambiguous/unknown event)
            var fragment = this.interface.getEvent(eventName);
            return this._normalizeRunningEvent(new FragmentRunningEvent(this.address, this.interface, fragment));
        }
        // We have topics to filter by...
        if (eventName.topics && eventName.topics.length > 0) {
            // Is it a known topichash? (throws if no matching topichash)
            try {
                var fragment = this.interface.getEvent(eventName.topics[0]);
                return this._normalizeRunningEvent(new FragmentRunningEvent(this.address, this.interface, fragment, eventName.topics));
            }
            catch (error) { }
            // Filter by the unknown topichash
            var filter = {
                address: this.address,
                topics: eventName.topics
            };
            return this._normalizeRunningEvent(new RunningEvent(getEventTag(filter), filter));
        }
        return this._normalizeRunningEvent(new WildcardRunningEvent(this.address, this.interface));
    };
    Contract.prototype._checkRunningEvents = function (runningEvent) {
        if (runningEvent.listenerCount() === 0) {
            delete this._runningEvents[runningEvent.tag];
            // If we have a poller for this, remove it
            var emit = this._wrappedEmits[runningEvent.tag];
            if (emit) {
                this.provider.off(runningEvent.filter, emit);
                delete this._wrappedEmits[runningEvent.tag];
            }
        }
    };
    // Subclasses can override this to gracefully recover
    // from parse errors if they wish
    Contract.prototype._wrapEvent = function (runningEvent, log, listener) {
        var _this = this;
        var event = properties_1.deepCopy(log);
        event.removeListener = function () {
            if (!listener) {
                return;
            }
            runningEvent.removeListener(listener);
            _this._checkRunningEvents(runningEvent);
        };
        event.getBlock = function () { return _this.provider.getBlock(log.blockHash); };
        event.getTransaction = function () { return _this.provider.getTransaction(log.transactionHash); };
        event.getTransactionReceipt = function () { return _this.provider.getTransactionReceipt(log.transactionHash); };
        // This may throw if the topics and data mismatch the signature
        runningEvent.prepareEvent(event);
        return event;
    };
    Contract.prototype._addEventListener = function (runningEvent, listener, once) {
        var _this = this;
        if (!this.provider) {
            logger.throwError("events require a provider or a signer with a provider", logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: "once" });
        }
        runningEvent.addListener(listener, once);
        // Track this running event and its listeners (may already be there; but no hard in updating)
        this._runningEvents[runningEvent.tag] = runningEvent;
        // If we are not polling the provider, start polling
        if (!this._wrappedEmits[runningEvent.tag]) {
            var wrappedEmit = function (log) {
                var event = _this._wrapEvent(runningEvent, log, listener);
                // Try to emit the result for the parameterized event...
                if (event.decodeError == null) {
                    try {
                        var args = runningEvent.getEmit(event);
                        _this.emit.apply(_this, __spreadArrays([runningEvent.filter], args));
                    }
                    catch (error) {
                        event.decodeError = error.error;
                    }
                }
                // Always emit "event" for fragment-base events
                if (runningEvent.filter != null) {
                    _this.emit("event", event);
                }
                // Emit "error" if there was an error
                if (event.decodeError != null) {
                    _this.emit("error", event.decodeError, event);
                }
            };
            this._wrappedEmits[runningEvent.tag] = wrappedEmit;
            // Special events, like "error" do not have a filter
            if (runningEvent.filter != null) {
                this.provider.on(runningEvent.filter, wrappedEmit);
            }
        }
    };
    Contract.prototype.queryFilter = function (event, fromBlockOrBlockhash, toBlock) {
        var _this = this;
        var runningEvent = this._getRunningEvent(event);
        var filter = properties_1.shallowCopy(runningEvent.filter);
        if (typeof (fromBlockOrBlockhash) === "string" && bytes_1.isHexString(fromBlockOrBlockhash, 32)) {
            if (toBlock != null) {
                logger.throwArgumentError("cannot specify toBlock with blockhash", "toBlock", toBlock);
            }
            filter.blockhash = fromBlockOrBlockhash;
        }
        else {
            filter.fromBlock = ((fromBlockOrBlockhash != null) ? fromBlockOrBlockhash : 0);
            filter.toBlock = ((toBlock != null) ? toBlock : "latest");
        }
        return this.provider.getLogs(filter).then(function (logs) {
            return logs.map(function (log) { return _this._wrapEvent(runningEvent, log, null); });
        });
    };
    Contract.prototype.on = function (event, listener) {
        this._addEventListener(this._getRunningEvent(event), listener, false);
        return this;
    };
    Contract.prototype.once = function (event, listener) {
        this._addEventListener(this._getRunningEvent(event), listener, true);
        return this;
    };
    Contract.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.provider) {
            return false;
        }
        var runningEvent = this._getRunningEvent(eventName);
        var result = (runningEvent.run(args) > 0);
        // May have drained all the "once" events; check for living events
        this._checkRunningEvents(runningEvent);
        return result;
    };
    Contract.prototype.listenerCount = function (eventName) {
        if (!this.provider) {
            return 0;
        }
        return this._getRunningEvent(eventName).listenerCount();
    };
    Contract.prototype.listeners = function (eventName) {
        if (!this.provider) {
            return [];
        }
        if (eventName == null) {
            var result_1 = [];
            for (var tag in this._runningEvents) {
                this._runningEvents[tag].listeners().forEach(function (listener) {
                    result_1.push(listener);
                });
            }
            return result_1;
        }
        return this._getRunningEvent(eventName).listeners();
    };
    Contract.prototype.removeAllListeners = function (eventName) {
        if (!this.provider) {
            return this;
        }
        if (eventName == null) {
            for (var tag in this._runningEvents) {
                var runningEvent_1 = this._runningEvents[tag];
                runningEvent_1.removeAllListeners();
                this._checkRunningEvents(runningEvent_1);
            }
            return this;
        }
        // Delete any listeners
        var runningEvent = this._getRunningEvent(eventName);
        runningEvent.removeAllListeners();
        this._checkRunningEvents(runningEvent);
        return this;
    };
    Contract.prototype.off = function (eventName, listener) {
        if (!this.provider) {
            return this;
        }
        var runningEvent = this._getRunningEvent(eventName);
        runningEvent.removeListener(listener);
        this._checkRunningEvents(runningEvent);
        return this;
    };
    Contract.prototype.removeListener = function (eventName, listener) {
        return this.off(eventName, listener);
    };
    return Contract;
}());
exports.Contract = Contract;
var ContractFactory = /** @class */ (function () {
    function ContractFactory(contractInterface, bytecode, signer) {
        var _newTarget = this.constructor;
        var bytecodeHex = null;
        if (typeof (bytecode) === "string") {
            bytecodeHex = bytecode;
        }
        else if (bytes_1.isBytes(bytecode)) {
            bytecodeHex = bytes_1.hexlify(bytecode);
        }
        else if (bytecode && typeof (bytecode.object) === "string") {
            // Allow the bytecode object from the Solidity compiler
            bytecodeHex = bytecode.object;
        }
        else {
            // Crash in the next verification step
            bytecodeHex = "!";
        }
        // Make sure it is 0x prefixed
        if (bytecodeHex.substring(0, 2) !== "0x") {
            bytecodeHex = "0x" + bytecodeHex;
        }
        // Make sure the final result is valid bytecode
        if (!bytes_1.isHexString(bytecodeHex) || (bytecodeHex.length % 2)) {
            logger.throwArgumentError("invalid bytecode", "bytecode", bytecode);
        }
        // If we have a signer, make sure it is valid
        if (signer && !abstract_signer_1.Signer.isSigner(signer)) {
            logger.throwArgumentError("invalid signer", "signer", signer);
        }
        properties_1.defineReadOnly(this, "bytecode", bytecodeHex);
        properties_1.defineReadOnly(this, "interface", properties_1.getStatic((_newTarget), "getInterface")(contractInterface));
        properties_1.defineReadOnly(this, "signer", signer || null);
    }
    ContractFactory.prototype.getDeployTransaction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var tx = {};
        // If we have 1 additional argument, we allow transaction overrides
        if (args.length === this.interface.deploy.inputs.length + 1 && typeof (args[args.length - 1]) === "object") {
            tx = properties_1.shallowCopy(args.pop());
            for (var key in tx) {
                if (!allowedTransactionKeys[key]) {
                    throw new Error("unknown transaction override " + key);
                }
            }
        }
        // Do not allow these to be overridden in a deployment transaction
        ["data", "from", "to"].forEach(function (key) {
            if (tx[key] == null) {
                return;
            }
            logger.throwError("cannot override " + key, logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: key });
        });
        // Make sure the call matches the constructor signature
        logger.checkArgumentCount(args.length, this.interface.deploy.inputs.length, " in Contract constructor");
        // Set the data to the bytecode + the encoded constructor arguments
        tx.data = bytes_1.hexlify(bytes_1.concat([
            this.bytecode,
            this.interface.encodeDeploy(args)
        ]));
        return tx;
    };
    ContractFactory.prototype.deploy = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var overrides, params, unsignedTx, tx, address, contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        overrides = {};
                        // If 1 extra parameter was passed in, it contains overrides
                        if (args.length === this.interface.deploy.inputs.length + 1) {
                            overrides = args.pop();
                        }
                        // Make sure the call matches the constructor signature
                        logger.checkArgumentCount(args.length, this.interface.deploy.inputs.length, " in Contract constructor");
                        return [4 /*yield*/, resolveAddresses(this.signer, args, this.interface.deploy.inputs)];
                    case 1:
                        params = _a.sent();
                        params.push(overrides);
                        unsignedTx = this.getDeployTransaction.apply(this, params);
                        return [4 /*yield*/, this.signer.sendTransaction(unsignedTx)];
                    case 2:
                        tx = _a.sent();
                        address = properties_1.getStatic(this.constructor, "getContractAddress")(tx);
                        contract = properties_1.getStatic(this.constructor, "getContract")(address, this.interface, this.signer);
                        properties_1.defineReadOnly(contract, "deployTransaction", tx);
                        return [2 /*return*/, contract];
                }
            });
        });
    };
    ContractFactory.prototype.attach = function (address) {
        return (this.constructor).getContract(address, this.interface, this.signer);
    };
    ContractFactory.prototype.connect = function (signer) {
        return new (this.constructor)(this.interface, this.bytecode, signer);
    };
    ContractFactory.fromSolidity = function (compilerOutput, signer) {
        if (compilerOutput == null) {
            logger.throwError("missing compiler output", logger_1.Logger.errors.MISSING_ARGUMENT, { argument: "compilerOutput" });
        }
        if (typeof (compilerOutput) === "string") {
            compilerOutput = JSON.parse(compilerOutput);
        }
        var abi = compilerOutput.abi;
        var bytecode = null;
        if (compilerOutput.bytecode) {
            bytecode = compilerOutput.bytecode;
        }
        else if (compilerOutput.evm && compilerOutput.evm.bytecode) {
            bytecode = compilerOutput.evm.bytecode;
        }
        return new this(abi, bytecode, signer);
    };
    ContractFactory.getInterface = function (contractInterface) {
        return Contract.getInterface(contractInterface);
    };
    ContractFactory.getContractAddress = function (tx) {
        return address_1.getContractAddress(tx);
    };
    ContractFactory.getContract = function (address, contractInterface, signer) {
        return new Contract(address, contractInterface, signer);
    };
    return ContractFactory;
}());
exports.ContractFactory = ContractFactory;
