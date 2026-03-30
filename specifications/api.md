# Promptel API Documentation

This document outlines the JavaScript API for working with Promptel prompts.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [API Reference](#api-reference)
   - [createPromptel](#createpromptel)
   - [parsePrompt](#parseprompt)
   - [executePrompt](#executeprompt)
   - [PromptelExecutor](#promptelexecutor)

## Installation

To use Promptel in your project, install it via npm:

```bash
npm install promptel
```

## Basic Usage

Here's a basic example of how to use Promptel:

```javascript
const createPromptel = require('promptel');

const promptel = createPromptel('your-openai-api-key');

const promptCode = `
prompt ExamplePrompt {
  params {
    name: string;
  }
  body {
    text\`Hello, \${params.name}! How are you today?\`;
  }
}`;

async function runPrompt() {
  const ast = promptel.parsePrompt(promptCode);
  const result = await promptel.executePrompt(ast, { name: "Alice" });
  console.log(result);
}

runPrompt();
```

## API Reference

### createPromptel

Creates a new instance of the Promptel system.

```javascript
const promptel = createPromptel(apiKey: string): Promptel
```

- `apiKey`: Your OpenAI API key.
- Returns: An object with methods to parse and execute Promptel prompts.

### parsePrompt

Parses a Promptel prompt string into an Abstract Syntax Tree (AST).

```javascript
const ast = promptel.parsePrompt(promptCode: string): PromptAST
```

- `promptCode`: A string containing the Promptel prompt code.
- Returns: An AST representing the parsed prompt.

### executePrompt

Executes a parsed Promptel prompt with the given parameters.

```javascript
const result = await promptel.executePrompt(ast: PromptAST, params: object): Promise<any>
```

- `ast`: The AST of the prompt, as returned by `parsePrompt`.
- `params`: An object containing the parameter values for the prompt.
- Returns: A Promise that resolves to the result of executing the prompt.

### PromptelExecutor

The `PromptelExecutor` class provides lower-level control over prompt execution.

```javascript
const executor = new promptel.Executor(apiKey: string)
```

#### Methods

- `execute(ast: PromptAST, params: object): Promise<any>`
  Executes a prompt AST with the given parameters.

- `registerPrompt(name: string, ast: PromptAST): void`
  Registers a prompt AST for later use with the `use` keyword.

- `callLLM(prompt: string, constraints: object): Promise<string>`
  Makes a direct call to the LLM with the given prompt and constraints.

## Error Handling

All methods may throw errors if there are issues with parsing, execution, or API calls. It's recommended to wrap calls in try-catch blocks for proper error handling.

## Advanced Usage

For advanced usage, including working with specific techniques or customizing the execution process, please refer to the ADVANCED_TECHNIQUES.md document.