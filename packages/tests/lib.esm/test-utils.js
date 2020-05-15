'use strict';
import assert from 'assert';
import { ddamers } from "ddamers";
describe('Test Contract Address Generation', function () {
    // @TODO: Mine a large collection of these from the blockchain
    let getContractAddress = ddamers.utils.getContractAddress;
    let Tests = [
        {
            address: '0x619df4d45850d72196c467dd553b94fb66c737dfd8157f09eb4d8e8416f310fe',
            name: 'tx-0x939aa179 (number)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: 55,
            }
        },
        // Transaction: 0x939aa17985bc2a52a0c1cba9497ef09e092355a805a8150e30e24b753bac6864
        {
            address: '0xb382ffb899dca6ec3e4f2743ae706cbba04f06e6d924c2f6e625dad9d8c09207',
            name: 'tx-0x939aa179 (number)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: 10,
            }
        },
        {
            address: '0xb382ffb899dca6ec3e4f2743ae706cbba04f06e6d924c2f6e625dad9d8c09207',
            name: 'tx-0x939aa179 (odd-zero-hex)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: "0xa",
            }
        },
        {
            address: '0xb382ffb899dca6ec3e4f2743ae706cbba04f06e6d924c2f6e625dad9d8c09207',
            name: 'tx-0x939aa179 (even-zero-hex)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: "0x0a",
            }
        },
        // Ropsten: https://etherscan.io/tx/0x78d17f8ab31fb6ad688340634a9a29d8726feb6d588338a9b9b21a44159bc916
        {
            address: '0xc5b1a3e1e26a69f919e354d798ea88326124a5dd45b48583e9ee50c096043737',
            name: 'tx-0x78d17f8a (odd-long-hex)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: "0x200",
            }
        },
        {
            address: '0xc5b1a3e1e26a69f919e354d798ea88326124a5dd45b48583e9ee50c096043737',
            name: 'tx-0x78d17f8a (even-long-hex)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: "0x0200",
            }
        },
        // https://ropsten.etherscan.io/tx/0x444ea8ae9890ac0ee5fd249512726abf9d23f44a378d5f45f727b65dc1b899c2
        {
            address: '0x161d023b795adbe7af641f8e646e9761e86460ff35990cae7b9ad8cbaa089774',
            name: 'tx-0x444ea8ae (even-long-hex)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: "0x1d",
            }
        },
        {
            address: '0x161d023b795adbe7af641f8e646e9761e86460ff35990cae7b9ad8cbaa089774',
            name: 'tx-0x444ea8ae (padded-long-hex)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: "0x001d",
            }
        },
        {
            address: '0x161d023b795adbe7af641f8e646e9761e86460ff35990cae7b9ad8cbaa089774',
            name: 'tx-0x444ea8ae (number)',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: 29,
            }
        },
        // Ropsten: 0x5bdfd14fcc917abc2f02a30721d152a6f147f09e8cbaad4e0d5405d646c5c3e1
        {
            address: '0x628cb8115284ab72ba5f731e9889e22c7fab8007c187402a6521a2a7bce5eb2a',
            name: 'zero-nonce',
            tx: {
                from: '0x3f7bbdccda4a5e7f245e659abe90286cadf95b0f5c5546bb4971fd6c8d4ffde7',
                nonce: 0
            }
        },
    ];
    Tests.forEach(function (test) {
        it(('Computes the transaction address - ' + test.name), function () {
            this.timeout(120000);
            assert.equal(getContractAddress(test.tx), test.address, 'computes the transaction address');
        });
    });
});
