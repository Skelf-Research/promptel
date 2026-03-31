const PromptelParser = require('../src/parser');

// Mock harmony-protocol-js before requiring executor
jest.mock('harmony-protocol-js', () => ({
  HarmonyRenderer: class MockHarmonyRenderer {},
  Conversation: class MockConversation {
    addMessage() {}
  },
  Message: {
    system: (content) => ({ role: 'system', content }),
    developer: (content) => ({ role: 'developer', content }),
    user: (content) => ({ role: 'user', content })
  },
  Role: {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system'
  },
  ReasoningEffort: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },
  Channel: {
    FINAL: 'final'
  },
  DEFAULT_HARMONY_ENCODING: {
    renderConversation: () => 'mocked conversation',
    parseMessagesFromText: (text) => [
      { role: 'assistant', channel: 'final', content: 'Mocked response' }
    ]
  },
  createSystemContent: () => ({
    withKnowledgeCutoff: () => ({
      withReasoningEffort: () => ({
        withRequiredChannels: (channels) => ({
          channels: channels
        })
      })
    }),
    withRequiredChannels: (channels) => ({
      channels: channels
    })
  })
}));

const PromptelExecutor = require('../src/executor');

describe('PromptelExecutor', () => {
  let parser;
  let executor;

  beforeEach(() => {
    // Set fake API key for testing
    process.env.PROMPTEL_API_KEY = 'fake-key-for-testing';

    parser = new PromptelParser();
    executor = new PromptelExecutor('openai', 'fake-key');

    // Mock the callLLM method
    executor.callLLM = async function(prompt, constraints) {
      return 'Mocked LLM response';
    };

    // Mock the provider to avoid actual API calls
    executor.provider = {
      generateResponse: async (prompt, constraints) => 'Mocked response'
    };
  });

  test('should execute a simple prompt', async () => {
    const code = `
      prompt SimplePrompt {
        body {
          text\`Hello, world!\`
        }
      }
    `;
    const ast = parser.parse(code);
    const result = await executor.execute(ast);
    expect(result).toContain('Hello, world!');
  });

  test('should handle params correctly', async () => {
    const code = `
      prompt ParamPrompt {
        params {
          name: string
          age: number = 30
        }
        body {
          text\`Hello, \${params.name}! You are \${params.age} years old.\`
        }
      }
    `;
    const ast = parser.parse(code);
    const result = await executor.execute(ast, { name: 'Alice' });
    expect(result).toContain('Hello, Alice!');
    expect(result).toContain('30 years old');
  });

  test.skip('should handle techniques', async () => {
    const code = `
      prompt TechniquePrompt {
        technique {
          chainOfThought {
            step("Step 1") {
              text\`This is step 1\`
            }
            step("Step 2") {
              text\`This is step 2\`
            }
          }
        }
        body {
          text\`Final answer\`
        }
      }
    `;
    const ast = parser.parse(code);
    const result = await executor.execute(ast);
    expect(result).toContain('Step: Step 1');
    expect(result).toContain('This is step 1');
    expect(result).toContain('Step: Step 2');
    expect(result).toContain('This is step 2');
    expect(result).toContain('Final answer');
  });

  test('should handle Harmony integration', async () => {
    const code = `
      prompt HarmonyPrompt {
        harmony {
          reasoning: "high"
          channels: ["final", "analysis"]
        }
        body {
          text\`Solve this problem step by step\`
        }
      }
    `;
    const ast = parser.parse(code);

    // Mock Harmony response parsing
    executor.callLLM = async function(prompt, constraints) {
      return '<|start|>assistant<|channel|>final<|message|>The answer is 42<|end|>';
    };

    const result = await executor.execute(ast);
    expect(result.success).toBe(true);
    expect(result.channels).toBeDefined();
    expect(result.channels.final).toContain('Mocked response');
  });
});