export interface NetworkState {
  readonly blockHeight: number;
  readonly blockTime: number;
}

export interface TransactionState {
  readonly nLockTime: number;
  readonly nSequence: number;
}

export interface TransactionInputState {
  readonly script: Uint8Array;
}

export interface MinimumProgramState extends TransactionInputState {
  /**
   * Instruction Pointer – the array index at which the script is currently
   * executing.
   */
  // tslint:disable-next-line:readonly-keyword
  ip: number;
}

export interface StackMachineState<StackTypes = number | Uint8Array> {
  // tslint:disable-next-line:readonly-keyword
  error?: string;
  // tslint:disable-next-line:readonly-array readonly-keyword
  stack: StackTypes[];
}
