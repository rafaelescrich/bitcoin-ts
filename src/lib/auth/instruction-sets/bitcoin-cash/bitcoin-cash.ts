import { InstructionSet } from '../../virtual-machine';
import {
  CommonAuthenticationError,
  pushDataConstantOperators,
  pushDataVariableOperators,
  pushNumberOperators,
  undefinedOperator
} from '../common/common';
import {
  MinimumProgramState,
  NetworkState,
  StackMachineState,
  TransactionState
} from '../common/state';
// import { BitcoinCashOpCodes } from './bitcoin-cash-opcodes';

export enum BitcoinCashAuthenticationError {
  // TODO:
  todo = 'todo'
}

export interface BitcoinCashAuthenticationProgramState
  extends NetworkState,
    TransactionState,
    MinimumProgramState,
    StackMachineState {
  // tslint:disable-next-line:readonly-keyword
  error?: BitcoinCashAuthenticationError | CommonAuthenticationError;
}

// tslint:disable:no-expression-statement
export const bitcoinCashInstructionSet: InstructionSet<
  BitcoinCashAuthenticationProgramState
> = {
  clone: (state: BitcoinCashAuthenticationProgramState) => ({
    ...(state.error !== undefined ? { error: state.error } : {}),
    blockHeight: state.blockHeight,
    blockTime: state.blockTime,
    ip: state.ip,
    nLockTime: state.nLockTime,
    nSequence: state.nSequence,
    script: state.script.slice(),
    stack: state.stack.slice()
  }),
  continue: (state: BitcoinCashAuthenticationProgramState) =>
    state.error === undefined && state.ip < state.script.length,
  next: (state: BitcoinCashAuthenticationProgramState) => {
    // tslint:disable-next-line:no-object-mutation
    state.ip++;
    return state;
  },
  ...undefinedOperator<
    BitcoinCashAuthenticationError,
    BitcoinCashAuthenticationProgramState
  >(),
  ...pushNumberOperators<BitcoinCashAuthenticationProgramState>(),
  ...pushDataConstantOperators<
    BitcoinCashAuthenticationError,
    BitcoinCashAuthenticationProgramState
  >(),
  ...pushDataVariableOperators<
    BitcoinCashAuthenticationError,
    BitcoinCashAuthenticationProgramState
  >()
};
// tslint:enable: no-object-mutation
