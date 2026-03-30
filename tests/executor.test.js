// executor.test.js
const PromptelExecutor = require('../src/executor');
const PromptelParser = require('../src/parser');

jest.mock('../src/provider', () => ({
  createProvider: jest.fn(() => ({
    generateResponse: jest.fn((prompt, constraints) => {
      // For testing purposes, return the prompt to check the output
      return prompt;
    }),
  })),
}));
describe('PromptelExecutor', () => {
  let executor;
  let parser;

  beforeEach(() => {
    // Read provider and key from environment variables
    const provider = process.env.PROMPTEL_PROVIDER || 'openai';
    const apiKey = process.env.PROMPTEL_API_KEY || 'test-api-key';
    
    executor = new PromptelExecutor(provider, apiKey);
    parser = new PromptelParser();
  });

  test('should execute a simple prompt', async () => {\n    const code = `\n      prompt SimplePrompt {\n        body {\n          text`Hello, world!`;\n        }\n      }\n    `;\n    const ast = parser.parse(code);\n    const result = await executor.execute(ast);\n    expect(result).toBe('Task:\\nHello, world!');\n  });\n\n  test('should handle params correctly', async () => {\n    const code = `\n      prompt ParamPrompt {\n        params {\n          name: string;\n          age: number = 30;\n        }\n        body {\n          text`Hello, ${params.name}! You are ${params.age} years old.`;\n        }\n      }\n    `;\n    const ast = parser.parse(code);\n    const result = await executor.execute(ast, { name: 'Alice' });\n    expect(result).toBe('Task:\\nHello, Alice! You are 30 years old.');\n  });\n\n  test('should execute if statements', async () => {\n    const code = `\n      prompt ConditionalPrompt {\n        params {\n          condition: boolean;\n        }\n        body {\n          if (params.condition) {\n            text`Condition is true`;\n          } else {\n            text`Condition is false`;\n          }\n        }\n      }\n    `;\n    const ast = parser.parse(code);\n    const resultTrue = await executor.execute(ast, { condition: true });\n    expect(resultTrue).toBe('Task:\\nCondition is true');\n    const resultFalse = await executor.execute(ast, { condition: false });\n    expect(resultFalse).toBe('Task:\\nCondition is false');\n  });\n\n  test('should execute for loops', async () => {\n    const code = `\n      prompt LoopPrompt {\n        params {\n          items: string[];\n        }\n        body {\n          for (item of params.items) {\n            text`Item: ${item}\\n`;\n          }\n        }\n      }\n    `;\n    const ast = parser.parse(code);\n    const result = await executor.execute(ast, { items: ['apple', 'banana', 'cherry'] });\n    expect(result).toBe('Task:\\nItem: apple\\nItem: banana\\nItem: cherry\\n');\n  });\n\n  test('should handle techniques', async () => {\n    const code = `\n      prompt TechniquePrompt {\n        technique {\n          chainOfThought {\n            step(\"Step 1\") {\n              text`This is step 1`;\n            }\n            step(\"Step 2\") {\n              text`This is step 2`;\n            }\n          }\n        }\n        body {\n          text`Final answer`;\n        }\n      }\n    `;\n    const ast = parser.parse(code);\n    const result = await executor.execute(ast);\n    expect(result).toContain('Chain of Thought:');\n    expect(result).toContain('Step: Step 1');\n    expect(result).toContain('This is step 1');\n    expect(result).toContain('Step: Step 2');\n    expect(result).toContain('This is step 2');\n    expect(result).toContain('Task:\\nFinal answer');\n  });\n\n  test('should handle hooks', async () => {\n    const code = `\n      prompt HookPrompt {\n        params {\n          name: string;\n        }\n        hooks {\n          preProcess: (input) => {\n            input.name = input.name.toUpperCase();\n            return input;\n          }\n        }\n        body {\n          text`Hello,  ${params.name}!`;\n        }\n      }\n    `;\n    const ast = parser.parse(code);\n    const result = await executor.execute(ast, { name: 'Alice' });\n    expect(result).toBe('Task:\\nHello, Alice!');\n  });
