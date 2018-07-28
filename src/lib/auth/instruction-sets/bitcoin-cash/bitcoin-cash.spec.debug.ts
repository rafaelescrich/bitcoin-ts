// tslint:disable:no-expression-statement no-magic-numbers
import { deepStrictEqual } from 'assert';
import { hexToBin, range } from '../../../utils';
import {
  bitcoinCashInstructionSet,
  createAuthenticationVirtualMachine
} from '../../auth';
import { serializeScript } from '../common/common';
import { BitcoinCashOpCodes } from './bitcoin-cash-opcodes';

const vm = createAuthenticationVirtualMachine(bitcoinCashInstructionSet);

const opcode = BitcoinCashOpCodes.OP_DATA_10;
const num = 10;

const baseState = {
  blockHeight: 0,
  blockTime: 0,
  ip: 0,
  nLockTime: 0,
  nSequence: 0,
  script: new Uint8Array([
    BitcoinCashOpCodes.OP_5,
    opcode,
    ...range(num, 1),
    BitcoinCashOpCodes.OP_5
  ]),
  stack: []
};

const result = vm.debug({ ...baseState });

deepStrictEqual(result, {
  ...baseState,
  ...{ ip: num + 2, stack: [5, new Uint8Array(range(num, 1)), 5] }
});

// examples from chain of transactions here : https://en.bitcoin.it/wiki/Transaction

// example P2PK : from 5a4ebf66822b0b2d56bd9dc64ece0bc38ee7844a23ff1d7320a88c5fdb2ad3e2
// const lockingScript = hexToBin('4104283338ffd784c198147f99aed2cc16709c90b1522e3b3637b312a6f9130e0eda7081e373a96d36be319710cd5c134aaffba81ff08650d7de8af332fe4d8cde20ac');
// const unlockingScript = hexToBin('48304502206e21798a42fae0e854281abd38bacd1aeed3ee3738d9e1446618c4571d1090db022100e2ac980643b0b82c0e88ffdfec6b64e3e6ba35e7ba5fdd7d5d6cc8d25c6b241501');

// example P2PKH : 0c04096b6500773010eb042da00b9b2224afc63fe42f3379bfb1fecd4f528c5f : inputs[1]
const lockingScript = hexToBin(
  '76a914404371705fa9bd789a2fcd52d2c580b65d35549d88ac'
);
const unlockingScript = hexToBin(
  '493046022100c0e77d0b559d2c3c18af307509faefe5d646714755024be062d82a0eeaf6258e022100ed3ebfe3fd60f087870f69c96c557b1fd6ca7007c373990de4a84df30442f889014104d4fb35c2cdb822644f1057e9bd07e3d3b0a36702662327ef4eb799eb219856d0fd884fce43082b73424a3293837c5f94a478f7bc4ec4da82bfb7e0b43fb218cc'
);

const script = serializeScript(unlockingScript, lockingScript);

vm.debug({ ...baseState, script });
