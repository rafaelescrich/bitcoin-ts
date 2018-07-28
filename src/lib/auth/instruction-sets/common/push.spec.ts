// tslint:disable:no-expression-statement no-magic-numbers
import { range } from '../../../utils';
import { BitcoinCashOpCodes } from '../bitcoin-cash/bitcoin-cash-opcodes';
import { testOperator } from '../instruction-sets.spec.helper';
import {
  CommonAuthenticationError,
  CommonAuthenticationErrorState
} from './common';
import {
  pushData1,
  pushData2,
  pushData4,
  pushData4Enabled,
  pushDataConstant,
  pushNumber
} from './push';
import { MinimumProgramState, StackMachineState } from './state';

const base: () => MinimumProgramState &
  StackMachineState &
  CommonAuthenticationErrorState<{}> = () => ({
  ip: 1,
  script: new Uint8Array(),
  stack: []
});

testOperator('OP_1', 'works', pushNumber(1), {
  description: 'Push the number 1 onto the stack.',
  steps: [
    [base(), { stack: [1] }],
    [{ ...base(), stack: [42] }, { stack: [42, 1] }]
  ]
});

testOperator('OP_16', 'works', pushNumber(16), {
  description: 'Push the number 16 onto the stack.',
  steps: [
    [base(), { stack: [16] }],
    [{ ...base(), stack: [42] }, { stack: [42, 16] }]
  ]
});

testOperator('OP_DATA_1', 'works', pushDataConstant(1), {
  description: 'Push the next byte onto the stack as binary data.',
  steps: [
    [
      {
        ...base(),
        script: new Uint8Array([BitcoinCashOpCodes.OP_DATA_1, 42])
      },
      { ip: 2, stack: [new Uint8Array([42])] }
    ]
  ]
});

testOperator('OP_DATA_5', 'works', pushDataConstant(5), {
  description: 'Push the next 5 bytes onto the stack as binary data.',
  steps: [
    [
      {
        ...base(),
        script: new Uint8Array([
          BitcoinCashOpCodes.OP_DATA_5,
          5,
          10,
          15,
          20,
          25
        ])
      },
      { ip: 6, stack: [new Uint8Array([5, 10, 15, 20, 25])] }
    ]
  ]
});

testOperator(
  'OP_DATA_6',
  'errors when push is malformed',
  pushDataConstant(6),
  {
    description: 'Push the next 6 bytes onto the stack as binary data.',
    steps: [
      [
        {
          ...base(),
          script: new Uint8Array([
            BitcoinCashOpCodes.OP_DATA_5,
            5,
            10,
            15,
            20,
            25
          ])
        },
        {
          error: CommonAuthenticationError.malformedPush
        }
      ]
    ]
  }
);

const pushData1Description =
  'Read the next Uint8 and push that number of bytes to the stack.';

const pushData1Push = range(100, 1);
const pushData1Script = new Uint8Array([
  BitcoinCashOpCodes.OP_PUSHDATA1,
  100,
  ...pushData1Push
]);

testOperator('OP_PUSHDATA1', 'works', pushData1(), {
  description: pushData1Description,
  steps: [
    [
      {
        ...base(),
        script: pushData1Script
      },
      {
        ip: pushData1Script.length,
        stack: [new Uint8Array(pushData1Push)]
      }
    ]
  ]
});

testOperator(
  'OP_PUSHDATA1',
  `can't be the last byte in the script`,
  pushData1(),
  {
    description: pushData1Description,
    steps: [
      [
        {
          ...base(),
          script: new Uint8Array([BitcoinCashOpCodes.OP_PUSHDATA1])
        },
        {
          error: CommonAuthenticationError.malformedPush
        }
      ]
    ]
  }
);

testOperator('OP_PUSHDATA1', 'fails on non-minimal push', pushData1(), {
  description: pushData1Description,
  steps: [
    [
      {
        ...base(),
        script: new Uint8Array([
          BitcoinCashOpCodes.OP_PUSHDATA1,
          50,
          ...range(50, 1)
        ])
      },
      {
        error: CommonAuthenticationError.nonMinimalPush
      }
    ]
  ]
});

testOperator(
  'OP_PUSHDATA1',
  `requires enough bytes to push the expected number of bytes`,
  pushData1(),
  {
    description: pushData1Description,
    steps: [
      [
        {
          ...base(),
          script: new Uint8Array([BitcoinCashOpCodes.OP_PUSHDATA1, 4, 1, 2, 3])
        },
        {
          error: CommonAuthenticationError.malformedPush
        }
      ]
    ]
  }
);

const pushData2Description =
  'Read the next little-endian Uint16 and push that number of bytes to the stack.';

const pushData2Push = range(257, 1);
const pushData2Script = new Uint8Array([
  BitcoinCashOpCodes.OP_PUSHDATA2,
  1,
  1,
  ...pushData2Push
]);

testOperator('OP_PUSHDATA2', 'works', pushData2(), {
  description: pushData2Description,
  steps: [
    [
      {
        ...base(),
        script: pushData2Script
      },
      {
        ip: pushData2Script.length,
        stack: [new Uint8Array(pushData2Push)]
      }
    ]
  ]
});

testOperator(
  'OP_PUSHDATA2',
  `can't be the last byte in the script`,
  pushData2(),
  {
    description: pushData2Description,
    steps: [
      [
        {
          ...base(),
          script: new Uint8Array([BitcoinCashOpCodes.OP_PUSHDATA2])
        },
        {
          error: CommonAuthenticationError.malformedPush
        }
      ]
    ]
  }
);

testOperator('OP_PUSHDATA2', 'fails on non-minimal push', pushData2(), {
  description: pushData2Description,
  steps: [
    [
      {
        ...base(),
        script: new Uint8Array([
          BitcoinCashOpCodes.OP_PUSHDATA2,
          50,
          0,
          ...range(50, 1)
        ])
      },
      {
        error: CommonAuthenticationError.nonMinimalPush
      }
    ]
  ]
});

testOperator(
  'OP_PUSHDATA2',
  `requires enough bytes to push the expected number of bytes`,
  pushData2(),
  {
    description: pushData2Description,
    steps: [
      [
        {
          ...base(),
          script: new Uint8Array([
            BitcoinCashOpCodes.OP_PUSHDATA2,
            0,
            4,
            1,
            2,
            3
          ])
        },
        {
          error: CommonAuthenticationError.malformedPush
        }
      ]
    ]
  }
);

const pushData4Description =
  'Read the next little-endian Uint32 and push that number of bytes to the stack.';

const pushData4Push = range(256 ** 2 + 1, 1);
const pushData4Script = new Uint8Array([
  BitcoinCashOpCodes.OP_PUSHDATA4,
  1,
  0,
  1,
  0,
  ...pushData4Push
]);

testOperator('OP_PUSHDATA4', 'enabled: works', pushData4Enabled(), {
  description: pushData4Description,
  steps: [
    [
      {
        ...base(),
        script: pushData4Script
      },
      {
        ip: pushData4Script.length,
        stack: [new Uint8Array(pushData4Push)]
      }
    ]
  ]
});

testOperator(
  'OP_PUSHDATA4',
  `enabled: can't be the last byte in the script`,
  pushData4Enabled(),
  {
    description: pushData4Description,
    steps: [
      [
        {
          ...base(),
          script: new Uint8Array([BitcoinCashOpCodes.OP_PUSHDATA4])
        },
        {
          error: CommonAuthenticationError.malformedPush
        }
      ]
    ]
  }
);

testOperator(
  'OP_PUSHDATA4',
  'enabled: fails on non-minimal push',
  pushData4Enabled(),
  {
    description: pushData4Description,
    steps: [
      [
        {
          ...base(),
          script: new Uint8Array([
            BitcoinCashOpCodes.OP_PUSHDATA4,
            50,
            0,
            0,
            0,
            ...range(50, 1)
          ])
        },
        {
          error: CommonAuthenticationError.nonMinimalPush
        }
      ]
    ]
  }
);

testOperator(
  'OP_PUSHDATA4',
  `enabled: requires enough bytes to push the expected number of bytes`,
  pushData4Enabled(),
  {
    description: pushData4Description,
    steps: [
      [
        {
          ...base(),
          script: new Uint8Array([
            BitcoinCashOpCodes.OP_PUSHDATA4,
            1,
            0,
            1,
            0,
            100,
            101,
            103
          ])
        },
        {
          error: CommonAuthenticationError.malformedPush
        }
      ]
    ]
  }
);

testOperator('OP_PUSHDATA4', `should never work`, pushData4(), {
  description: pushData4Description,
  steps: [
    [
      {
        ...base(),
        script: new Uint8Array([BitcoinCashOpCodes.OP_PUSHDATA4, 4, 1, 2, 3])
      },
      {
        error: CommonAuthenticationError.nonMinimalPush
      }
    ]
  ]
});
