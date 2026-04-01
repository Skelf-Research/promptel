# Dual Format Guide: .prompt vs .yml

Promptel supports two equivalent formats for defining prompts: the native `.prompt` declarative syntax and YAML `.yml` format. Both formats compile to identical ASTs and provide the same functionality.

## Format Comparison

### Native .prompt Format
- **Syntax**: Custom declarative language optimized for prompt engineering
- **Strengths**: Concise, readable, purpose-built for prompts
- **Use Case**: When you prefer domain-specific syntax

```prompt
prompt MathSolver {
  meta {
    name: "Math Problem Solver"
    version: "1.0"
  }

  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }

  params {
    problem: string
    difficulty: string = "medium"
  }

  body {
    text`Solve: ${params.problem} (${params.difficulty} level)`
  }

  technique {
    chainOfThought {
      steps:
        step("Analysis") { text`Analyze the problem` }
        step("Solution") { text`Calculate step by step` }
        step("Verification") { text`Verify the answer` }
    }
  }
}
```

### YAML .yml Format
- **Syntax**: Standard YAML configuration format
- **Strengths**: Familiar to DevOps teams, easy integration with CI/CD
- **Use Case**: When you prefer structured configuration files

```yaml
name: MathSolver

meta:
  name: "Math Problem Solver"
  version: "1.0"

harmony:
  reasoning: "high"
  channels:
    - "final"
    - "analysis"

params:
  problem:
    type: string
    required: true
  difficulty:
    type: string
    default: "medium"
    required: false

body:
  text: "Solve: ${params.problem} (${params.difficulty} level)"

technique:
  chainOfThought:
    steps:
      - name: "Analysis"
        text: "Analyze the problem"
      - name: "Solution"
        text: "Calculate step by step"
      - name: "Verification"
        text: "Verify the answer"
```

## Feature Parity

Both formats support identical features:

| Feature | .prompt | .yml | Notes |
|---------|---------|------|-------|
| Meta information | ✅ | ✅ | Name, version, description |
| Harmony Protocol | ✅ | ✅ | Reasoning levels, channels |
| Parameters | ✅ | ✅ | Types, defaults, optionals |
| Body text | ✅ | ✅ | Template literals supported |
| Techniques | ✅ | ✅ | CoT, ToT, ReAct, etc. |
| Constraints | ✅ | ✅ | Token limits, temperature |
| Output schemas | ✅ | ✅ | Format specifications |
| Hooks | ✅ | ✅ | Pre/post processing |

## Usage Patterns

### Universal Parsing
```javascript
import { parsePrompt } from 'promptel';

// Works with either format automatically
const promptAst = parsePrompt(promptContent, 'solver.prompt');
const yamlAst = parsePrompt(yamlContent, 'solver.yml');
```

### Universal Execution
```javascript
import { executePrompt } from 'promptel';

// Both work identically
const result1 = await executePrompt(promptContent, params);
const result2 = await executePrompt(yamlContent, params);
```

### Format Conversion
```javascript
import { FormatConverter } from 'promptel';

const converter = new FormatConverter();

// Convert .prompt to YAML
const yamlVersion = converter.promptToYaml(promptContent);

// Convert YAML to .prompt
const promptVersion = converter.yamlToPrompt(yamlContent);

// Auto-detect and convert
const converted = converter.convert(content, 'auto', 'yaml');
```

### CLI Usage
```bash
# Execute either format
promptel -f solver.prompt -p openai -k $API_KEY --params '{...}'
promptel -f solver.yml -p openai -k $API_KEY --params '{...}'

# Convert between formats
promptel --convert yaml -f solver.prompt -o solver.yml
promptel --convert prompt -f solver.yml -o solver.prompt
```

## Format Detection

The system automatically detects format based on:

1. **File extension**: `.prompt`, `.yml`, `.yaml`
2. **Content analysis**: YAML structure vs prompt syntax
3. **Manual override**: `--format` CLI option

## Migration Guide

### From .prompt to YAML
1. Use the converter: `promptel --convert yaml -f your-prompt.prompt`
2. Review the generated YAML for accuracy
3. Test both versions produce identical results

### From YAML to .prompt
1. Use the converter: `promptel --convert prompt -f your-prompt.yml`
2. Review the generated .prompt syntax
3. Test both versions produce identical results

## Best Practices

### Choose .prompt when:
- Building prompt-engineering focused workflows
- Working primarily with AI/ML teams
- Preferring concise, domain-specific syntax
- Need maximum readability for prompt logic

### Choose YAML when:
- Integrating with existing YAML-based infrastructure
- Working with DevOps/platform teams
- Need configuration management compatibility
- Prefer standardized configuration formats

### Team Consistency
- Pick one format per project for consistency
- Use format conversion for cross-team collaboration
- Document your format choice in project README

## Technical Implementation

Both formats:
1. Parse to identical AST structures
2. Use the same execution engine
3. Support all Promptel features
4. Maintain format information for round-trip conversion
5. Provide identical performance characteristics

The dual format support adds zero runtime overhead - format detection and parsing happen once at load time.

## Examples in Repository

See the `examples/` directory for equivalent prompts in both formats:

- `simple_harmony.prompt` ↔ `simple_harmony.yml`
- `math_solver.prompt` ↔ `math_solver.yml`
- `harmony_math_solver.prompt` ↔ `harmony_math_solver.yml`

All examples demonstrate feature parity and can be used interchangeably.