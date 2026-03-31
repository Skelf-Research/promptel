# Promptel Examples

This directory contains example prompts and test scripts demonstrating Promptel capabilities.

## Example Prompts (.prompt files)

### Basic Examples
- **[math_solver.prompt](math_solver.prompt)** - Simple math problem solver with Chain-of-Thought
- **[creative_writer.prompt](creative_writer.prompt)** - Creative writing with multiple techniques
- **[problem_solver.prompt](problem_solver.prompt)** - General problem solving framework

### Harmony Protocol Examples
- **[simple_harmony.prompt](simple_harmony.prompt)** - Basic Harmony Protocol usage
- **[harmony_math_solver.prompt](harmony_math_solver.prompt)** - Advanced math solving with multi-channel outputs

## Test Scripts

### Integration Tests
- **[tests/test_harmony.js](tests/test_harmony.js)** - Comprehensive Harmony Protocol integration test
- **[tests/test_basic_parser.js](tests/test_basic_parser.js)** - Parser functionality test

### Debug Tools
- **[debug_tokenize.js](debug_tokenize.js)** - Token analysis and debugging utility

## Running Examples

### Using CLI
```bash
# Basic math solver
promptel -f examples/math_solver.prompt -p openai -k $OPENAI_API_KEY --params '{"problem":"What is 25% of 240?"}'

# Harmony Protocol example (requires gpt-oss access)
promptel -f examples/simple_harmony.prompt -p openai -k $OPENAI_API_KEY --params '{"question":"Explain quantum computing"}'
```

### Using JavaScript API
```javascript
import { parsePrompt, executePrompt } from 'promptel';
import fs from 'fs';

const promptCode = fs.readFileSync('examples/math_solver.prompt', 'utf-8');
const prompt = parsePrompt(promptCode);

const result = await executePrompt(prompt, {
  problem: "Calculate compound interest"
}, {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

console.log(result);
```

### Running Integration Tests
```bash
# Test Harmony Protocol integration
node examples/tests/test_harmony.js

# Test basic parser functionality
node examples/tests/test_basic_parser.js
```

## Creating Your Own Examples

1. Create a `.prompt` file with your prompt definition
2. Test it using the CLI or JavaScript API
3. Consider adding it to this examples collection via PR

For more details, see the main [documentation](../docs/) or [README](../README.md).