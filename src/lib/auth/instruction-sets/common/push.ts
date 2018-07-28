import { Operator } from '../../virtual-machine';
import { BitcoinCashOpCodes } from '../bitcoin-cash/bitcoin-cash-opcodes';
import { MinimumProgramState, StackMachineState } from '../instruction-sets';
import {
  applyError,
  CommonAuthenticationError,
  CommonAuthenticationErrorState
} from './common';

export const pushNumber = <ProgramState extends StackMachineState>(
  value: number
): Operator<ProgramState> => ({
  asm: `OP_${value}`,
  description: `Push the number ${value} onto the stack.`,
  operation: (state: ProgramState) => {
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(value);
    return state;
  }
});

export const pushNumberOpCodes: ReadonlyArray<BitcoinCashOpCodes> = [
  BitcoinCashOpCodes.OP_1NEGATE,
  BitcoinCashOpCodes.OP_0,
  BitcoinCashOpCodes.OP_1,
  BitcoinCashOpCodes.OP_2,
  BitcoinCashOpCodes.OP_3,
  BitcoinCashOpCodes.OP_4,
  BitcoinCashOpCodes.OP_5,
  BitcoinCashOpCodes.OP_6,
  BitcoinCashOpCodes.OP_7,
  BitcoinCashOpCodes.OP_8,
  BitcoinCashOpCodes.OP_9,
  BitcoinCashOpCodes.OP_10,
  BitcoinCashOpCodes.OP_11,
  BitcoinCashOpCodes.OP_12,
  BitcoinCashOpCodes.OP_13,
  BitcoinCashOpCodes.OP_14,
  BitcoinCashOpCodes.OP_15,
  BitcoinCashOpCodes.OP_16
];

export const pushNumberOperators = <ProgramState extends StackMachineState>() =>
  pushNumberOpCodes
    .map((opcode, i) => ({ [opcode]: pushNumber<ProgramState>(i - 1) }))
    .reduce((group, current) => ({ ...group, ...current }));

export const pushDataConstant = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    CommonAuthenticationErrorState<InstructionSetError>
>(
  value: number
): Operator<ProgramState> => ({
  asm: `OP_DATA_${value}`,
  description: `Push the next ${
    value === 1 ? 'byte' : `${value} bytes`
  } onto the stack as binary data.`,
  // tslint:disable:no-if-statement no-expression-statement no-object-mutation
  operation: (state: ProgramState) => {
    const pushStart = state.ip;
    const pushEnd = state.ip + value;
    if (state.script.length < pushEnd) {
      return applyError(CommonAuthenticationError.malformedPush, state);
    }
    state.stack.push(state.script.slice(pushStart, pushEnd));
    state.ip = pushEnd;
    return state;
  }
  // tslint:disable:no-if-statement no-expression-statement no-object-mutation
});

export const pushDataConstantOpCodes: ReadonlyArray<BitcoinCashOpCodes> = [
  BitcoinCashOpCodes.OP_DATA_1,
  BitcoinCashOpCodes.OP_DATA_2,
  BitcoinCashOpCodes.OP_DATA_3,
  BitcoinCashOpCodes.OP_DATA_4,
  BitcoinCashOpCodes.OP_DATA_5,
  BitcoinCashOpCodes.OP_DATA_6,
  BitcoinCashOpCodes.OP_DATA_7,
  BitcoinCashOpCodes.OP_DATA_8,
  BitcoinCashOpCodes.OP_DATA_9,
  BitcoinCashOpCodes.OP_DATA_10,
  BitcoinCashOpCodes.OP_DATA_11,
  BitcoinCashOpCodes.OP_DATA_12,
  BitcoinCashOpCodes.OP_DATA_13,
  BitcoinCashOpCodes.OP_DATA_14,
  BitcoinCashOpCodes.OP_DATA_15,
  BitcoinCashOpCodes.OP_DATA_16,
  BitcoinCashOpCodes.OP_DATA_17,
  BitcoinCashOpCodes.OP_DATA_18,
  BitcoinCashOpCodes.OP_DATA_19,
  BitcoinCashOpCodes.OP_DATA_20,
  BitcoinCashOpCodes.OP_DATA_21,
  BitcoinCashOpCodes.OP_DATA_22,
  BitcoinCashOpCodes.OP_DATA_23,
  BitcoinCashOpCodes.OP_DATA_24,
  BitcoinCashOpCodes.OP_DATA_25,
  BitcoinCashOpCodes.OP_DATA_26,
  BitcoinCashOpCodes.OP_DATA_27,
  BitcoinCashOpCodes.OP_DATA_28,
  BitcoinCashOpCodes.OP_DATA_29,
  BitcoinCashOpCodes.OP_DATA_30,
  BitcoinCashOpCodes.OP_DATA_31,
  BitcoinCashOpCodes.OP_DATA_32,
  BitcoinCashOpCodes.OP_DATA_33,
  BitcoinCashOpCodes.OP_DATA_34,
  BitcoinCashOpCodes.OP_DATA_35,
  BitcoinCashOpCodes.OP_DATA_36,
  BitcoinCashOpCodes.OP_DATA_37,
  BitcoinCashOpCodes.OP_DATA_38,
  BitcoinCashOpCodes.OP_DATA_39,
  BitcoinCashOpCodes.OP_DATA_40,
  BitcoinCashOpCodes.OP_DATA_41,
  BitcoinCashOpCodes.OP_DATA_42,
  BitcoinCashOpCodes.OP_DATA_43,
  BitcoinCashOpCodes.OP_DATA_44,
  BitcoinCashOpCodes.OP_DATA_45,
  BitcoinCashOpCodes.OP_DATA_46,
  BitcoinCashOpCodes.OP_DATA_47,
  BitcoinCashOpCodes.OP_DATA_48,
  BitcoinCashOpCodes.OP_DATA_49,
  BitcoinCashOpCodes.OP_DATA_50,
  BitcoinCashOpCodes.OP_DATA_51,
  BitcoinCashOpCodes.OP_DATA_52,
  BitcoinCashOpCodes.OP_DATA_53,
  BitcoinCashOpCodes.OP_DATA_54,
  BitcoinCashOpCodes.OP_DATA_55,
  BitcoinCashOpCodes.OP_DATA_56,
  BitcoinCashOpCodes.OP_DATA_57,
  BitcoinCashOpCodes.OP_DATA_58,
  BitcoinCashOpCodes.OP_DATA_59,
  BitcoinCashOpCodes.OP_DATA_60,
  BitcoinCashOpCodes.OP_DATA_61,
  BitcoinCashOpCodes.OP_DATA_62,
  BitcoinCashOpCodes.OP_DATA_63,
  BitcoinCashOpCodes.OP_DATA_64,
  BitcoinCashOpCodes.OP_DATA_65,
  BitcoinCashOpCodes.OP_DATA_66,
  BitcoinCashOpCodes.OP_DATA_67,
  BitcoinCashOpCodes.OP_DATA_68,
  BitcoinCashOpCodes.OP_DATA_69,
  BitcoinCashOpCodes.OP_DATA_70,
  BitcoinCashOpCodes.OP_DATA_71,
  BitcoinCashOpCodes.OP_DATA_72,
  BitcoinCashOpCodes.OP_DATA_73,
  BitcoinCashOpCodes.OP_DATA_74,
  BitcoinCashOpCodes.OP_DATA_75
];

export const pushDataConstantOperators = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    CommonAuthenticationErrorState<InstructionSetError>
>() =>
  pushDataConstantOpCodes
    .map((opcode, i) => ({
      [opcode]: pushDataConstant<InstructionSetError, ProgramState>(i + 1)
    }))
    .reduce((group, current) => ({ ...group, ...current }));

type Uint = 'Uint8' | 'Uint16' | 'Uint32';

const pushDataVariableDescription = (type: Uint) =>
  `Read the next ${
    type === 'Uint8' ? '' : 'little-endian '
  }${type} and push that number of bytes to the stack.`;

export const pushData = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    CommonAuthenticationErrorState<InstructionSetError>
>(
  value: number,
  type: Uint,
  minimum: number
): Operator<ProgramState> => ({
  asm: `OP_PUSHDATA${value}`,
  description: pushDataVariableDescription(type),
  // tslint:disable:cyclomatic-complexity no-if-statement no-expression-statement no-object-mutation
  operation: (state: ProgramState) => {
    if (state.script.length < state.ip + value) {
      return applyError(CommonAuthenticationError.malformedPush, state);
    }
    const pushBegin = state.ip + value;
    const view = new DataView(state.script.buffer, state.ip, value);
    const readAsLittleEndian = true;
    const length =
      type === 'Uint8'
        ? view.getUint8(0)
        : type === 'Uint16'
          ? view.getUint16(0, readAsLittleEndian)
          : view.getUint32(0, readAsLittleEndian);
    if (state.script.length < pushBegin + length) {
      return applyError(CommonAuthenticationError.malformedPush, state);
    }
    if (length < minimum) {
      return applyError(CommonAuthenticationError.nonMinimalPush, state);
    }
    const pushEnd = pushBegin + length;
    state.stack.push(state.script.slice(pushBegin, pushEnd));
    state.ip = pushEnd;
    return state;
  }
  // tslint:enable:cyclomatic-complexity no-if-statement no-expression-statement no-object-mutation
});

const maximumPushDataConstant = 75;

export const pushData1 = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    CommonAuthenticationErrorState<InstructionSetError>
>() =>
  pushData<InstructionSetError, ProgramState>(
    Uint8Array.BYTES_PER_ELEMENT,
    'Uint8',
    maximumPushDataConstant
  );

const byteStates = 256;
const highestRepresentableNumberIn = (bytes: number) => byteStates ** bytes;

export const pushData2 = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    CommonAuthenticationErrorState<InstructionSetError>
>() =>
  pushData<InstructionSetError, ProgramState>(
    Uint16Array.BYTES_PER_ELEMENT,
    'Uint16',
    highestRepresentableNumberIn(Uint8Array.BYTES_PER_ELEMENT)
  );

export const pushData4Enabled = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    CommonAuthenticationErrorState<InstructionSetError>
>() =>
  pushData<InstructionSetError, ProgramState>(
    Uint32Array.BYTES_PER_ELEMENT,
    'Uint32',
    highestRepresentableNumberIn(Uint16Array.BYTES_PER_ELEMENT)
  );

/**
 * For Instruction Sets where both minimal pushes and the 520-byte push limit
 * are required, `OP_PUSHDATA4` will always error. For the working
 * `OP_PUSHDATA4`, use `pushData4Enabled`.
 */
export const pushData4 = <
  InstructionSetError,
  ProgramState extends CommonAuthenticationErrorState<InstructionSetError>
>(): Operator<ProgramState> => ({
  asm: 'OP_PUSHDATA4',
  description: pushDataVariableDescription('Uint32'),
  operation: (state: ProgramState) =>
    applyError(CommonAuthenticationError.nonMinimalPush, state)
});

export const pushDataVariableOperators = <
  InstructionSetError,
  ProgramState extends StackMachineState &
    MinimumProgramState &
    CommonAuthenticationErrorState<InstructionSetError>
>() => ({
  [BitcoinCashOpCodes.OP_PUSHDATA1]: pushData1<
    InstructionSetError,
    ProgramState
  >(),
  [BitcoinCashOpCodes.OP_PUSHDATA2]: pushData2<
    InstructionSetError,
    ProgramState
  >(),
  [BitcoinCashOpCodes.OP_PUSHDATA4]: pushData4<
    InstructionSetError,
    ProgramState
  >()
});
