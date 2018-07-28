// tslint:disable:no-expression-statement
import { test } from 'ava';
import { AuthenticationVirtualMachine, Operator } from '../virtual-machine';
import { MinimumProgramState } from './common/common';

export interface OperatorSpec<ProgramState> {
  readonly description: string;
  readonly steps: ReadonlyArray<Expectation<ProgramState>>;
}

export type Expectation<ProgramState> = [ProgramState, Partial<ProgramState>];

const orderedSpread = <ProgramState>(
  first: ProgramState,
  second: Partial<ProgramState>
) =>
  // https://github.com/Microsoft/TypeScript/issues/10727
  (({
    ...(first as {}),
    ...(second as {})
    // tslint:disable-next-line:no-any
  } as any) as ProgramState);

export const testOperator = <ProgramState>(
  name: string,
  description: string = '',
  operator: Operator<ProgramState>,
  spec: OperatorSpec<ProgramState>
) => {
  test(description === '' ? name : `${name}: ${description}`, t => {
    t.deepEqual(operator.asm, name);
    t.deepEqual(operator.description, spec.description);
    spec.steps.map(pair => {
      const before = pair[0];
      const after = orderedSpread(before, pair[1]);
      t.deepEqual(operator.operation(before), after);
    });
  });
};

export const testVMOperation = <ProgramState extends MinimumProgramState>(
  name: string,
  getVm: () => AuthenticationVirtualMachine<ProgramState>,
  steps: ReadonlyArray<Expectation<ProgramState>>
) => {
  const vm = getVm();
  steps.map((set, index) => {
    test(`${name}: test ${index + 1}`, t => {
      const before = set[0];
      const after = orderedSpread(before, set[1]);
      t.deepEqual(vm.evaluate(before), after);
    });
  });
};
