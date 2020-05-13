'use strict';

import assert from 'assert';

import { ethers } from "ethers";
const ddamers = ethers;

describe('Test Contract Address Generation', function() {

    // @TODO: Mine a large collection of these from the blockchain

    let getContractAddress = ddamers.utils.getContractAddress;

    let Tests = [
        // Transaction: 0x939aa17985bc2a52a0c1cba9497ef09e092355a805a8150e30e24b753bac6864
        {
            address: '0x3474627D4F63A678266BC17171D87f8570936622',
            name: 'tx-0x939aa179 (number)',
            tx: {
                from: '0xb2682160c482eb985ec9f3e364eec0a904c44c23',
                nonce: 10,
            }
        },

        {
            address: '0x3474627D4F63A678266BC17171D87f8570936622',
            name: 'tx-0x939aa179 (odd-zero-hex)',
            tx: {
                from: '0xb2682160c482eb985ec9f3e364eec0a904c44c23',
                nonce: "0xa",
            }
        },

        {
            address: '0x3474627D4F63A678266BC17171D87f8570936622',
            name: 'tx-0x939aa179 (even-zero-hex)',
            tx: {
                from: '0xb2682160c482eb985ec9f3e364eec0a904c44c23',
                nonce: "0x0a",
            }
        },

        // Ropsten: https://etherscan.io/tx/0x78d17f8ab31fb6ad688340634a9a29d8726feb6d588338a9b9b21a44159bc916
        {
            address: '0x271300790813f82638A8A6A8a86d65df6dF33c17',
            name: 'tx-0x78d17f8a (odd-long-hex)',
            tx: {
                from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
                nonce: "0x200",
            }
        },

        {
            address: '0x271300790813f82638A8A6A8a86d65df6dF33c17',
            name: 'tx-0x78d17f8a (even-long-hex)',
            tx: {
                from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
                nonce: "0x0200",
            }
        },

        // https://ropsten.etherscan.io/tx/0x444ea8ae9890ac0ee5fd249512726abf9d23f44a378d5f45f727b65dc1b899c2
        {
            address: '0x995C25706C407a1F1E84b3777775e3e619764933',
            name: 'tx-0x444ea8ae (even-long-hex)',
            tx: {
                from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
                nonce: "0x1d",
            }
        },

        {
            address: '0x995C25706C407a1F1E84b3777775e3e619764933',
            name: 'tx-0x444ea8ae (padded-long-hex)',
            tx: {
                from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
                nonce: "0x001d",
            }
        },

        {
            address: '0x995C25706C407a1F1E84b3777775e3e619764933',
            name: 'tx-0x444ea8ae (number)',
            tx: {
                from: '0x8ba1f109551bd432803012645ac136ddd64dba72',
                nonce: 29,
            }
        },

        // Ropsten: 0x5bdfd14fcc917abc2f02a30721d152a6f147f09e8cbaad4e0d5405d646c5c3e1
        {
            address: '0x0CcCC7507aEDf9FEaF8C8D731421746e16b4d39D',
            name: 'zero-nonce',
            tx: {
                from: '0xc6af6e1a78a6752c7f8cd63877eb789a2adb776c',
                nonce: 0
            }
        },
    ]

    Tests.forEach(function(test) {
        it(('Computes the transaction address - ' + test.name), function() {
            this.timeout(120000);
            assert.equal(getContractAddress(test.tx), test.address, 'computes the transaction address');
        });
    });
});
