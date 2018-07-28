// tslint:disable:no-expression-statement no-magic-numbers

import { range } from '../../../utils';
import { AuthenticationVirtualMachine } from '../../virtual-machine';
import { BitcoinCashAuthenticationProgramState } from '../bitcoin-cash/bitcoin-cash';
import { BitcoinCashOpCodes } from '../bitcoin-cash/bitcoin-cash-opcodes';
import { BitcoinAuthenticationProgramState } from '../bitcoin/bitcoin';
import { testVMOperation } from '../instruction-sets.spec.helper';
import { pushNumberOpCodes } from './common';
import { pushDataConstantOpCodes } from './push';

type commonVirtualMachine = AuthenticationVirtualMachine<
  BitcoinAuthenticationProgramState | BitcoinCashAuthenticationProgramState
>;

const baseState = {
  blockHeight: 0,
  blockTime: 0,
  ip: 0,
  nLockTime: 0,
  nSequence: 0,
  script: new Uint8Array(),
  stack: []
};

const pushNumberTests = (getVm: () => commonVirtualMachine) => {
  pushNumberOpCodes.map((opcode, index) => {
    const num = index - 1;
    const base = {
      ...baseState,
      script: new Uint8Array([opcode])
    };
    testVMOperation(`OP_${num}`, getVm, [
      [base, { ip: 1, stack: [num] }],
      [{ ...base, stack: [42] }, { ip: 1, stack: [42, num] }],
      [
        {
          ...baseState,
          script: new Uint8Array([opcode, opcode])
        },
        { ip: 2, stack: [num, num] }
      ]
    ]);
  });
};

const pushDataConstantTests = (getVm: () => commonVirtualMachine) => {
  pushDataConstantOpCodes.map((opcode, index) => {
    const num = index + 1;
    const script1 = new Uint8Array([opcode, ...range(num, 1)]);
    const script2 = new Uint8Array([
      BitcoinCashOpCodes.OP_5,
      opcode,
      ...range(num, 1),
      BitcoinCashOpCodes.OP_5
    ]);
    testVMOperation(`OP_DATA_${num}`, getVm, [
      [
        {
          ...baseState,
          script: script1
        },
        { ip: script1.length, stack: [new Uint8Array(range(num, 1))] }
      ],
      [
        {
          ...baseState,
          script: script2
        },
        { ip: script2.length, stack: [5, new Uint8Array(range(num, 1)), 5] }
      ]
    ]);
  });
};

const pushDataVariableTests = (getVm: () => commonVirtualMachine) => {
  const script = new Uint8Array([
    BitcoinCashOpCodes.OP_PUSHDATA1,
    100,
    ...range(100)
  ]);
  testVMOperation(`OP_PUSHDATA1`, getVm, [
    [
      {
        ...baseState,
        script
      },
      { ip: script.length, stack: [new Uint8Array(range(100))] }
    ]
  ]);
};

export const commonTests = (getVm: () => commonVirtualMachine) => {
  pushNumberTests(getVm);
  pushDataConstantTests(getVm);
  pushDataVariableTests(getVm);
};
