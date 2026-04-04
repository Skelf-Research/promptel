# API Reference

Complete reference for the Promptel JavaScript API.

## Installation

```bash
npm install promptel
```

## Quick Start

```javascript
const { parsePrompt, executePrompt } = require('promptel');

// Parse a prompt
const ast = parsePrompt(`
prompt Hello {
  body { text\`Hello, World!\` }
}
`);

// Execute a prompt
const result = await executePrompt(promptContent, { name: "World" });
```

---

## Functions

### parsePrompt(content, filename?)

Parse a prompt string into an AST. Auto-detects format.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `content` | `string` | Prompt content (.prompt or YAML) |
| `filename` | `string?` | Optional filename for format detection |

**Returns:** `Object` - Parsed AST

**Example:**

```javascript
const { parsePrompt } = require('promptel');

// Auto-detect format
const ast = parsePrompt(`
prompt Example {
  params { name: string }
  body { text\`Hello \${params.name}\` }
}
`);

// Use filename hint
const yamlAst = parsePrompt(yamlContent, 'config.yml');
```

---

### executePrompt(content, params?, options?)

Execute a prompt and return the result.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `content` | `string \| Object` | Prompt string or pre-parsed AST |
| `params` | `Object?` | Parameters to pass to the prompt |
| `options` | `Object?` | Execution options |

**Options:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `string` | `'openai'` | Provider name |
| `apiKey` | `string` | `env.PROMPTEL_API_KEY` | API key |
| `filename` | `string` | `''` | Filename for format detection |

**Returns:** `Promise<Object | string>` - Execution result

**Example:**

```javascript
const { executePrompt } = require('promptel');

const result = await executePrompt(`
prompt Greeter {
  params { name: string }
  body { text\`Say hello to \${params.name}\` }
}
`, {
  name: "Alice"
}, {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

console.log(result);
```

---

## Classes

### PromptelParser

Parser for the native .prompt format using Chevrotain.

**Methods:**

| Method | Description |
|--------|-------------|
| `parse(content)` | Parse .prompt content to AST |

**Example:**

```javascript
const { PromptelParser } = require('promptel');

const parser = new PromptelParser();
const ast = parser.parse(`
prompt Test {
  body { text\`Hello\` }
}
`);
```

---

### PromptelYamlParser

Parser for YAML format prompts.

**Methods:**

| Method | Description |
|--------|-------------|
| `parse(content)` | Parse YAML content to AST |

**Example:**

```javascript
const { PromptelYamlParser } = require('promptel');

const parser = new PromptelYamlParser();
const ast = parser.parse(`
name: Test
body:
  text: "Hello"
`);
```

---

### PromptelExecutor

Execution engine for parsed prompts.

**Constructor:**

```javascript
new PromptelExecutor(providerType, apiKey)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `providerType` | `string` | Provider: 'openai', 'claude', 'groq' |
| `apiKey` | `string` | API key for the provider |

**Methods:**

| Method | Description |
|--------|-------------|
| `execute(ast, params)` | Execute an AST with parameters |

**Example:**

```javascript
const { PromptelParser, PromptelExecutor } = require('promptel');

const parser = new PromptelParser();
const ast = parser.parse(promptContent);

const executor = new PromptelExecutor('openai', process.env.OPENAI_API_KEY);
const result = await executor.execute(ast, { input: "test" });
```

---

### FormatConverter

Bidirectional conversion between .prompt and YAML formats.

**Methods:**

| Method | Description |
|--------|-------------|
| `detectFormat(content, filename?)` | Detect content format |
| `parseAny(content, filename?)` | Parse any format to AST |
| `promptToYaml(content)` | Convert .prompt to YAML |
| `yamlToPrompt(content)` | Convert YAML to .prompt |
| `convert(content, from, to)` | Convert between formats |

**Example:**

```javascript
const { FormatConverter } = require('promptel');

const converter = new FormatConverter();

// Detect format
const format = converter.detectFormat(content);  // 'prompt' or 'yaml'

// Convert .prompt to YAML
const yaml = converter.promptToYaml(promptContent);

// Convert YAML to .prompt
const prompt = converter.yamlToPrompt(yamlContent);

// Generic conversion
const converted = converter.convert(content, 'prompt', 'yaml');
```

---

### ProviderInterface

Base class for implementing custom providers.

**Methods:**

| Method | Description |
|--------|-------------|
| `generateResponse(prompt, constraints)` | Generate LLM response |

**Example:**

```javascript
const { ProviderInterface } = require('promptel');

class CustomProvider extends ProviderInterface {
  constructor(apiKey) {
    super(apiKey);
    this.client = new MyLLMClient(apiKey);
  }

  async generateResponse(prompt, constraints) {
    const { maxTokens, temperature } = constraints;
    return await this.client.complete(prompt, { maxTokens, temperature });
  }
}
```

---

### createProvider(type, apiKey?)

Factory function to create provider instances.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `type` | `string` | Provider type |
| `apiKey` | `string?` | API key (defaults to env var) |

**Returns:** `ProviderInterface` - Provider instance

**Example:**

```javascript
const { createProvider } = require('promptel');

const openai = createProvider('openai', process.env.OPENAI_API_KEY);
const claude = createProvider('claude', process.env.ANTHROPIC_API_KEY);
const groq = createProvider('groq', process.env.GROQ_API_KEY);
```

---

## AST Structure

The parsed AST follows this structure:

```javascript
{
  type: 'Program',
  prompts: [{
    type: 'Prompt',
    name: 'PromptName',
    sections: [
      { type: 'meta', fields: [...] },
      { type: 'harmony', fields: [...] },
      { type: 'params', fields: [...] },
      { type: 'body', content: [...] },
      { type: 'technique', techniques: [...] },
      { type: 'constraints', fields: [...] },
      { type: 'output', fields: [...] },
      { type: 'hooks', hooks: [...] }
    ]
  }]
}
```

### Section Types

**params section:**
```javascript
{
  type: 'params',
  fields: [{
    type: 'ParamField',
    name: 'paramName',
    paramType: 'string',
    isOptional: false,
    defaultValue: 'default'
  }]
}
```

**body section:**
```javascript
{
  type: 'body',
  content: [{
    type: 'TextBlock',
    content: '`Hello ${params.name}`'
  }]
}
```

**constraints section:**
```javascript
{
  type: 'constraints',
  fields: [
    { name: 'maxTokens', value: 1000 },
    { name: 'temperature', value: 0.7 }
  ]
}
```

---

## TypeScript Types

```typescript
interface ParsedAST {
  type: 'Program';
  prompts: Prompt[];
}

interface Prompt {
  type: 'Prompt';
  name: string;
  sections: Section[];
}

interface ExecuteOptions {
  provider?: 'openai' | 'claude' | 'groq';
  apiKey?: string;
  filename?: string;
}

interface HarmonyResult {
  success: boolean;
  channels: {
    final?: string;
    analysis?: string;
    commentary?: string;
  };
  metadata: {
    reasoning: string;
    totalMessages: number;
    assistantMessages: number;
  };
}
```

---

## Error Handling

```javascript
const { parsePrompt, executePrompt } = require('promptel');

try {
  const ast = parsePrompt(invalidContent);
} catch (error) {
  if (error.message.includes('parsing error')) {
    console.error('Invalid prompt syntax');
  }
}

try {
  const result = await executePrompt(prompt, params);
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('Missing or invalid API key');
  } else if (error.message.includes('Missing required parameter')) {
    console.error('Missing parameter:', error.message);
  }
}
```

---

## Complete Example

```javascript
const {
  parsePrompt,
  executePrompt,
  FormatConverter,
  PromptelExecutor
} = require('promptel');

// Parse and inspect
const ast = parsePrompt(`
prompt DataAnalyzer {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }

  params {
    data: string
    format?: string = "json"
  }

  body {
    text\`Analyze this \${params.format} data: \${params.data}\`
  }

  constraints {
    maxTokens: 2000
    temperature: 0.5
  }
}
`);

console.log('Prompt name:', ast.prompts[0].name);
console.log('Sections:', ast.prompts[0].sections.map(s => s.type));

// Execute with options
const result = await executePrompt(ast, {
  data: '{"users": 150, "active": 42}'
}, {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

// Handle Harmony response
if (result.channels) {
  console.log('Answer:', result.channels.final);
  console.log('Reasoning:', result.channels.analysis);
} else {
  console.log('Result:', result);
}

// Convert to YAML
const converter = new FormatConverter();
const yamlVersion = converter.astToYaml(ast);
console.log('YAML version:', yamlVersion);
```
