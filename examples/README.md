# Promptel Examples

This directory contains example prompts and test scripts demonstrating Promptel capabilities.

## Example Prompts

Promptel supports two equivalent formats: **`.prompt`** (declarative syntax) and **`.yml`** (YAML format).

### Basic Examples
- **[math_solver.prompt](math_solver.prompt)** / **[math_solver.yml](math_solver.yml)** - Simple math problem solver with Chain-of-Thought
- **[creative_writer.prompt](creative_writer.prompt)** - Creative writing with multiple techniques
- **[problem_solver.prompt](problem_solver.prompt)** - General problem solving framework

### Harmony Protocol Examples
- **[simple_harmony.prompt](simple_harmony.prompt)** / **[simple_harmony.yml](simple_harmony.yml)** - Basic Harmony Protocol usage
- **[harmony_math_solver.prompt](harmony_math_solver.prompt)** / **[harmony_math_solver.yml](harmony_math_solver.yml)** - Advanced math solving with multi-channel outputs

### Format Comparison

The same prompt can be written in either format:

**`.prompt` format:**
```prompt
prompt MathSolver {
  params {
    problem: string
  }
  body {
    text`Solve: ${params.problem}`
  }
}
```

**`.yml` format:**
```yaml
name: MathSolver
params:
  problem:
    type: string
    required: true
body:
  text: "Solve: ${params.problem}"
```

## Test Scripts

### Integration Tests
- **[tests/test_harmony.js](tests/test_harmony.js)** - Comprehensive Harmony Protocol integration test
- **[tests/test_basic_parser.js](tests/test_basic_parser.js)** - Parser functionality test

### Debug Tools
- **[debug_tokenize.js](debug_tokenize.js)** - Token analysis and debugging utility

## Running Examples

### Using CLI

Both formats work identically:

```bash
# Basic math solver (.prompt format)
promptel -f examples/math_solver.prompt -p openai -k $OPENAI_API_KEY --params '{"problem":"What is 25% of 240?"}'

# Same prompt in YAML format
promptel -f examples/math_solver.yml -p openai -k $OPENAI_API_KEY --params '{"problem":"What is 25% of 240?"}'

# Harmony Protocol example (requires gpt-oss access)
promptel -f examples/simple_harmony.yml -p openai -k $OPENAI_API_KEY --params '{"question":"Explain quantum computing"}'

# Convert between formats
promptel --convert yaml -f examples/math_solver.prompt -o examples/converted.yml
promptel --convert prompt -f examples/simple_harmony.yml -o examples/converted.prompt
```

### Using JavaScript API
```javascript
import { parsePrompt, executePrompt, FormatConverter } from 'promptel';
import fs from 'fs';

// Works with either format automatically
const promptContent = fs.readFileSync('examples/math_solver.prompt', 'utf-8');
const yamlContent = fs.readFileSync('examples/math_solver.yml', 'utf-8');

// Both produce identical results
const result1 = await executePrompt(promptContent, { problem: "Calculate compound interest" });
const result2 = await executePrompt(yamlContent, { problem: "Calculate compound interest" });

// Convert between formats
const converter = new FormatConverter();
const convertedYaml = converter.promptToYaml(promptContent);
const convertedPrompt = converter.yamlToPrompt(yamlContent);
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