import { Operator } from '../../virtual-machine';
import { BitcoinCashOpCodes } from '../bitcoin-cash/bitcoin-cash-opcodes';

export * from './push';
export * from './state';

export const serializeScript = (
  unlockingScript: Uint8Array,
  lockingScript: Uint8Array
) => {
  const serialized = new Uint8Array(
    unlockingScript.length + lockingScript.length + 1
  );
  // tslint:disable:no-expression-statement
  serialized.set(unlockingScript, 0);
  serialized.set([BitcoinCashOpCodes.OP_CODESEPARATOR], unlockingScript.length);
  serialized.set(lockingScript, unlockingScript.length + 1);
  // tslint:enable:no-expression-statement
  return serialized;
};

export enum CommonAuthenticationError {
  malformedPush = 'Script must be long enough to push the requested number of bytes.',
  nonMinimalPush = 'Push operations must use the smallest possible encoding.',
  unknownOpcode = 'Called an unknown or unimplemented opcode.'
}

export interface CommonAuthenticationErrorState<InstructionSetError> {
  // tslint:disable-next-line:readonly-keyword
  error?: CommonAuthenticationError | InstructionSetError;
}

export const applyError = <
  InstructionSetError,
  ProgramState extends CommonAuthenticationErrorState<InstructionSetError>
>(
  error: CommonAuthenticationError,
  state: ProgramState
) =>
  // tslint:disable-next-line:no-object-literal-type-assertion
  ({
    ...(state as {}),
    error
  } as ProgramState);

export const undefinedOperator = <
  InstructionSetError,
  ProgramState extends CommonAuthenticationErrorState<InstructionSetError>
>(): { readonly undefined: Operator<ProgramState> } => ({
  undefined: {
    asm: 'undefined',
    description: 'An undefined or unimplemented opcode was called.',
    operation: (state: ProgramState) => {
      // tslint:disable-next-line:no-object-mutation no-expression-statement
      state.error = CommonAuthenticationError.unknownOpcode;
      return state;
    }
  }
});
