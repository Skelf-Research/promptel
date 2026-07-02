# Promptel

**Declarative prompt engineering. Write once, run anywhere.**

[![npm version](https://img.shields.io/npm/v/promptel.svg)](https://www.npmjs.com/package/promptel)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/skelf-research/promptel/pulls)

<p align="center">
  <a href="https://promptel.skelfresearch.com"><b>Website</b></a> •
  <a href="https://docs.skelfresearch.com/promptel">Documentation</a> •
  <a href="https://skelfresearch.com">Skelf Research</a>
</p>

---

## What is Promptel?

Promptel is a declarative framework for building production-grade LLM prompts. Define your prompts in a clean DSL or YAML, use built-in techniques like Chain-of-Thought, and deploy across OpenAI, Anthropic, or Groq without changing code.

```javascript
const { executePrompt } = require('promptel');

const result = await executePrompt(`
prompt CodeReviewer {
  params { code: string }

  body {
    text\`Review this code for bugs and security issues:
    \${params.code}\`
  }

  technique {
    chainOfThought {
      step("Security") { text\`Check for vulnerabilities\` }
      step("Logic") { text\`Identify bugs\` }
      step("Quality") { text\`Suggest improvements\` }
    }
  }
}
`, { code: userCode });
```

## Install

```bash
npm install promptel
```

## Quick Start

**1. Set your API key:**

```bash
export PROMPTEL_API_KEY=sk-your-key
```

**2. Create a prompt:**

```javascript
// app.js
const { executePrompt } = require('promptel');

async function main() {
  const result = await executePrompt(`
  prompt Summarizer {
    params { text: string }
    body { text\`Summarize in 2 sentences: \${params.text}\` }
    constraints { maxTokens: 100 }
  }
  `, { text: "Your long article here..." });

  console.log(result);
}

main();
```

**3. Run it:**

```bash
node app.js
```

## Features

| Feature | Description |
|---------|-------------|
| **Dual Format** | Write prompts in `.prompt` DSL or YAML |
| **Multi-Provider** | OpenAI, Anthropic, Groq with consistent API |
| **Techniques** | Built-in Chain-of-Thought, Few-Shot, Tree-of-Thoughts |
| **Harmony Protocol** | Native multi-channel responses (OpenAI) |
| **Type-Safe Params** | Typed parameters with defaults and validation |
| **CLI Included** | Execute and convert prompts from terminal |

## Formats

Promptel supports two equivalent formats:

<table>
<tr>
<th>.prompt (DSL)</th>
<th>YAML</th>
</tr>
<tr>
<td>

```javascript
prompt Greeter {
  params {
    name: string
    lang?: string = "en"
  }
  body {
    text`Hello ${params.name}!`
  }
}
```

</td>
<td>

```yaml
name: Greeter
params:
  name:
    type: string
    required: true
  lang:
    type: string
    default: "en"
body:
  text: "Hello ${params.name}!"
```

</td>
</tr>
</table>

Convert between them:

```bash
promptel --convert yaml -f prompt.prompt -o prompt.yml
```

## Providers

Switch providers without changing prompts:

```javascript
// OpenAI (default)
await executePrompt(prompt, params, { provider: 'openai' });

// Anthropic Claude
await executePrompt(prompt, params, { provider: 'claude' });

// Groq
await executePrompt(prompt, params, { provider: 'groq' });
```

## Techniques

Built-in prompting techniques:

```javascript
prompt Analyzer {
  technique {
    // Step-by-step reasoning
    chainOfThought {
      step("Understand") { text`Parse the input` }
      step("Analyze") { text`Find patterns` }
      step("Conclude") { text`Form conclusions` }
    }
  }
}
```

Available techniques:
- `chainOfThought` - Step-by-step reasoning
- `fewShot` - Learning from examples
- `zeroShot` - Direct instruction
- `treeOfThoughts` - Multiple solution paths
- `reAct` - Reasoning + Actions
- `selfConsistency` - Multi-sample consensus

## Harmony Protocol

Multi-channel responses for advanced reasoning:

```javascript
prompt HarmonyExample {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis", "commentary"]
  }

  body { text`Solve: ${params.problem}` }
}
```

```javascript
const result = await executePrompt(harmonyPrompt, { problem: "..." });

console.log(result.channels.final);      // Clean answer
console.log(result.channels.analysis);   // Reasoning steps
console.log(result.channels.commentary); // Additional context
```

## CLI

```bash
# Execute prompt
promptel -f prompt.prompt -p openai -k $KEY --params '{"x":"value"}'

# Convert formats
promptel --convert yaml -f prompt.prompt

# Output to file
promptel -f prompt.yml -p claude -k $KEY -o result.json
```

## API

```javascript
const {
  parsePrompt,      // Parse .prompt or YAML to AST
  executePrompt,    // Execute prompt end-to-end
  FormatConverter,  // Convert between formats
  PromptelExecutor, // Low-level executor
  createProvider,   // Create provider instance
} = require('promptel');

// Parse without executing
const ast = parsePrompt(promptContent);

// Execute with options
const result = await executePrompt(content, params, {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

// Convert formats programmatically
const converter = new FormatConverter();
const yaml = converter.promptToYaml(promptContent);
```

## Project Structure

```
promptel/
├── src/
│   ├── index.js          # Main exports
│   ├── parser.js         # .prompt parser (Chevrotain)
│   ├── yaml-parser.js    # YAML parser
│   ├── executor.js       # Execution engine
│   ├── provider.js       # LLM providers
│   ├── format-converter.js
│   └── cli.js
├── tests/
├── examples/
└── documentation/        # MkDocs site
```

## Development

```bash
git clone https://github.com/skelf-research/promptel.git
cd promptel
npm install

# Run tests
npm test

# Run linter
npm run lint

# Run integration tests
npm run test:integration
```

## Documentation

Full documentation available at [promptel.dev](https://promptel.dev) or in the `documentation/` folder:

- [Getting Started](documentation/docs/getting-started/installation.md)
- [Format Guide](documentation/docs/guides/formats.md)
- [Techniques](documentation/docs/guides/techniques.md)
- [Providers](documentation/docs/guides/providers.md)
- [Harmony Protocol](documentation/docs/guides/harmony.md)
- [API Reference](documentation/docs/reference/api.md)
- [CLI Reference](documentation/docs/reference/cli.md)

## Requirements

- Node.js 18+
- API key from OpenAI, Anthropic, or Groq

## Contributing

Contributions welcome! Please read our contributing guidelines and submit PRs.

```bash
npm run lint      # Check code style
npm test          # Run tests
npm run validate  # Full validation
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>Built for developers who ship AI to production.</b>
</p>

---

## Part of Skelf Research

`promptel` is built by **[Skelf Research](https://skelfresearch.com)** — an independent UK AI research lab publishing production-grade open-source projects.

🌐 [Website](https://promptel.skelfresearch.com) · 📚 [Documentation](https://docs.skelfresearch.com/promptel) · 🔬 [All projects](https://skelfresearch.com/projects) · 🤗 [Hugging Face](https://huggingface.co/skelfresearch)

**Related projects:** [blogus](https://blogus.skelfresearch.com) (package.lock for prompts), [route-switch](https://route-switch.skelfresearch.com) (self-improving LLM gateway), [perishable](https://perishable.skelfresearch.com) (hide your API keys)

<sub>Released under MIT / Apache-2.0. © Skelf Research Limited.</sub>
