# Promptel

**The first Node.js framework with native Harmony Protocol support for advanced prompt engineering.**

[![GitHub license](https://img.shields.io/github/license/terraprompt/promptel.svg)](https://github.com/terraprompt/promptel/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/promptel.svg)](https://www.npmjs.com/package/promptel)
[![Node.js CI](https://github.com/terraprompt/promptel/workflows/Node.js%20CI/badge.svg)](https://github.com/terraprompt/promptel/actions)

## Why Promptel?

Modern AI applications need sophisticated prompt engineering, but implementing advanced techniques like Chain-of-Thought or handling multi-channel responses is complex and error-prone. **Promptel solves this with a declarative approach and native support for OpenAI's Harmony Protocol.**

### Key Problems Solved

- **Harmony Protocol Complexity**: Only Node.js framework with native gpt-oss support
- **Advanced Reasoning Techniques**: Built-in Chain-of-Thought, Tree-of-Thoughts, ReAct
- **Multi-Channel Responses**: Automatic parsing of analysis, commentary, and final outputs
- **Provider Lock-in**: Abstract across OpenAI, Anthropic, Groq with consistent APIs

## Quick Start

### Installation

```bash
npm install promptel
```

### Basic Example

```javascript
import { parsePrompt, executePrompt } from 'promptel';

const prompt = parsePrompt(`
prompt MathSolver {
  params {
    problem: string
  }

  body {
    text\`Solve: \${params.problem}\`
  }

  technique {
    chainOfThought {
      step("Analysis") { text\`Break down the problem\` }
      step("Solution") { text\`Calculate step by step\` }
      step("Verification") { text\`Verify the answer\` }
    }
  }
}
`);

const result = await executePrompt(prompt, {
  problem: "What is 25% of 240?"
}, {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

console.log(result);
```

### Harmony Protocol Example (gpt-oss)

```javascript
const harmonyPrompt = parsePrompt(`
prompt HarmonyReasoning {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis", "commentary"]
  }

  params {
    question: string
  }

  body {
    text\`\${params.question}\`
  }
}
`);

const result = await executePrompt(harmonyPrompt, {
  question: "Optimize database query performance for large datasets"
});

// Multi-channel outputs automatically parsed
console.log(result.channels.final);      // Clean answer for users
console.log(result.channels.analysis);   // Detailed reasoning process
console.log(result.channels.commentary); // Verification and alternatives
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Parser Module  │    │ Executor Module │    │Provider Adapter │
│                 │    │                 │    │                 │
│ • Lexer/Parser  │◄──►│ • Harmony Integ │◄──►│ • OpenAI        │
│ • AST Builder   │    │ • Technique Eng │    │ • Anthropic     │
│ • Validation    │    │ • Output Format │    │ • Groq          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Flow**: `.prompt file` → `Parser` → `AST` → `Executor` → `Provider` → `LLM` → `Response Parser` → `Structured Output`

## Advanced Features

### Multi-Provider Support
```javascript
// Same prompt, different optimizations per provider
const executor = new PromptelExecutor(process.env.LLM_PROVIDER);
const result = await executor.execute(prompt, params);

// Harmony channels for OpenAI gpt-oss
// Thinking tags for Anthropic Claude
// Custom reasoning for Groq models
```

### Built-in Techniques
- **Chain of Thought**: Step-by-step reasoning
- **Tree of Thoughts**: Multiple solution paths
- **ReAct**: Reasoning + Action planning
- **Self-Consistency**: Multi-solution consensus

### Type-Safe Parameters
```typescript
params {
  temperature: number = 0.7
  max_tokens?: number
  difficulty: "easy" | "medium" | "hard"
}
```

## CLI Usage

```bash
# Execute prompt file
promptel -f solver.prompt -p openai -k $OPENAI_API_KEY --params '{"problem":"2+2"}'

# With output file
promptel -f prompt.prompt -p anthropic -k $ANTHROPIC_KEY -o result.json
```

## Requirements

- Node.js 18+ (LTS recommended)
- Supported provider API key (OpenAI, Anthropic, or Groq)

## Documentation

- **[Technical Overview](docs/TECHNICAL_OVERVIEW.md)** - Architecture and implementation details
- **[Harmony Design](docs/HARMONY_DESIGN.md)** - OpenAI Harmony Protocol integration
- **[Grammar Reference](docs/GRAMMAR.md)** - Complete language specification
- **[Development Tasks](docs/TODO.md)** - Project roadmap and tasks

## Contributing

We welcome contributions! Please see our development setup:

```bash
git clone https://github.com/terraprompt/promptel.git
cd promptel
npm install
npm test
npm run lint
```

## Performance

| Operation | Time (ms) | Memory (MB) |
|-----------|-----------|-------------|
| Parse prompt | 5-15 | 2-5 |
| Execute simple | 200-800 | 5-10 |
| Execute complex | 1000-3000 | 10-20 |
| Harmony parsing | 50-150 | 8-15 |

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [Technical docs](docs/)
- **Issues**: [GitHub Issues](https://github.com/terraprompt/promptel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/terraprompt/promptel/discussions)

---

**Promptel makes advanced prompt engineering accessible, maintainable, and scalable for production AI applications.**