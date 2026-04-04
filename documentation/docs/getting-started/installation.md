# Installation

Get Promptel installed and configured in your project.

## Requirements

- **Node.js** 18.0.0 or higher (LTS recommended)
- **npm** or **yarn** package manager
- API key from at least one supported provider

## Install via npm

```bash
npm install promptel
```

Or with yarn:

```bash
yarn add promptel
```

## Configuration

### Environment Variables

Promptel uses environment variables for configuration. Set your API key:

```bash
# OpenAI (default provider)
export PROMPTEL_API_KEY=sk-...

# Or specify provider explicitly
export PROMPTEL_PROVIDER=openai
export PROMPTEL_API_KEY=sk-...
```

For different providers:

```bash
# Anthropic Claude
export PROMPTEL_PROVIDER=claude
export PROMPTEL_API_KEY=sk-ant-...

# Groq
export PROMPTEL_PROVIDER=groq
export PROMPTEL_API_KEY=gsk_...
```

### Using .env Files

Create a `.env` file in your project root:

```ini
PROMPTEL_PROVIDER=openai
PROMPTEL_API_KEY=sk-your-key-here
```

Promptel automatically loads `.env` files via `dotenv`.

## Verify Installation

Test your installation:

```javascript
const { parsePrompt } = require('promptel');

const ast = parsePrompt(`
prompt Test {
  body {
    text\`Hello, World!\`
  }
}
`);

console.log('Promptel installed successfully!');
console.log('Parsed prompt:', ast.prompts[0].name);
```

Run it:

```bash
node test.js
# Output:
# Promptel installed successfully!
# Parsed prompt: Test
```

## Global CLI Installation

To use the `promptel` CLI globally:

```bash
npm install -g promptel
```

Verify:

```bash
promptel --version
```

## TypeScript Support

Promptel works with TypeScript out of the box. Type definitions are included in the package.

```typescript
import { parsePrompt, executePrompt, PromptelExecutor } from 'promptel';

const ast = parsePrompt(`
prompt TypedExample {
  params {
    input: string
  }
  body {
    text\`Process: \${params.input}\`
  }
}
`);
```

## Next Steps

- [Quick Start](quickstart.md) - Build your first prompt
- [Your First Prompt](first-prompt.md) - Detailed walkthrough
