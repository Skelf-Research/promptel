# Prompt Formats

Promptel supports two equivalent formats: the native `.prompt` syntax and YAML. Both compile to identical ASTs and support the same features.

## Format Comparison

| Feature | .prompt | YAML |
|---------|---------|------|
| Readability | Code-like, explicit | Data-like, familiar |
| Tooling | Custom syntax highlighting | Wide editor support |
| Verbosity | Concise | More verbose |
| Interpolation | Native `${...}` | String `${...}` |
| Best for | Complex prompts | Simple configs |

## .prompt Format

The native format uses a domain-specific language optimized for prompt engineering:

```javascript
prompt AnalysisHelper {
  meta {
    version: "1.0";
    author: "Team";
  }

  params {
    topic: string
    depth?: string = "medium"
  }

  body {
    text`Analyze ${params.topic} at ${params.depth} depth.`
  }

  constraints {
    maxTokens: 500
    temperature: 0.7
  }
}
```

### Syntax Elements

#### Comments

```javascript
// Single line comment
prompt Example {
  // Inline comment
  body {
    text`Content here`
  }
}
```

#### Parameters

```javascript
params {
  required: string           // Required parameter
  optional?: number          // Optional (?)
  withDefault: string = "x"  // With default value
  typed: boolean            // Type annotation
}
```

#### Text Blocks

```javascript
body {
  text`Single line content`

  text`Multi-line content
  spans multiple lines
  with interpolation: ${params.value}`
}
```

#### Techniques

```javascript
technique {
  chainOfThought {
    step("First") { text`Do first thing` }
    step("Second") { text`Do second thing` }
  }
}
```

## YAML Format

The same prompts can be written in YAML:

```yaml
name: AnalysisHelper

meta:
  version: "1.0"
  author: "Team"

params:
  topic:
    type: string
    required: true
  depth:
    type: string
    required: false
    default: "medium"

body:
  text: "Analyze ${params.topic} at ${params.depth} depth."

constraints:
  maxTokens: 500
  temperature: 0.7
```

### YAML Structure

#### Parameters

```yaml
params:
  name:
    type: string      # string, number, boolean
    required: true    # or false
    default: "value"  # optional default
```

#### Body Content

```yaml
body:
  text: "Simple single line"

# Or multiline:
body:
  text: |
    Multiline content
    with preserved newlines
    and ${params.interpolation}
```

#### Techniques

```yaml
technique:
  chainOfThought:
    steps:
      - name: First
        text: Do first thing
      - name: Second
        text: Do second thing
```

## Format Conversion

### CLI Conversion

Convert between formats using the CLI:

```bash
# .prompt to YAML
promptel --convert yaml -f prompt.prompt -o prompt.yml

# YAML to .prompt
promptel --convert prompt -f prompt.yml -o prompt.prompt
```

### Programmatic Conversion

```javascript
const { FormatConverter } = require('promptel');

const converter = new FormatConverter();

// .prompt to YAML
const yamlContent = converter.promptToYaml(promptContent);

// YAML to .prompt
const promptContent = converter.yamlToPrompt(yamlContent);

// Auto-detect and convert
const converted = converter.convert(content, 'auto', 'yaml');
```

## Auto-Detection

Promptel automatically detects the format:

```javascript
const { parsePrompt } = require('promptel');

// Detects .prompt format
parsePrompt(`prompt Test { body { text\`Hi\` } }`);

// Detects YAML format
parsePrompt(`name: Test\nbody:\n  text: "Hi"`);

// Uses filename hint
parsePrompt(content, 'myfile.yml');
```

### Detection Rules

1. **Filename extension** - `.prompt` or `.yml`/`.yaml`
2. **Content starts with** - `prompt ` = .prompt format
3. **Content starts with** - `name:` = YAML format
4. **Valid YAML parse** - Falls back to YAML if parseable

## Complete Example

Here's a full-featured prompt in both formats:

=== ".prompt"

    ```javascript
    prompt DataAnalyzer {
      meta {
        version: "2.0";
        description: "Analyzes data with structured reasoning";
      }

      harmony {
        reasoning: "high"
        channels: ["final", "analysis"]
      }

      params {
        data: string
        format?: string = "json"
        verbose?: boolean = false
      }

      body {
        text`Analyze the following ${params.format} data:

    ${params.data}

    Provide insights and recommendations.`
      }

      technique {
        chainOfThought {
          step("Parse") { text`Understand the data structure` }
          step("Analyze") { text`Identify patterns and anomalies` }
          step("Conclude") { text`Summarize findings` }
        }
      }

      constraints {
        maxTokens: 2000
        temperature: 0.5
        model: "gpt-4o"
      }

      output {
        format: "markdown"
      }
    }
    ```

=== "YAML"

    ```yaml
    name: DataAnalyzer

    meta:
      version: "2.0"
      description: Analyzes data with structured reasoning

    harmony:
      reasoning: high
      channels:
        - final
        - analysis

    params:
      data:
        type: string
        required: true
      format:
        type: string
        required: false
        default: "json"
      verbose:
        type: boolean
        required: false
        default: false

    body:
      text: |
        Analyze the following ${params.format} data:

        ${params.data}

        Provide insights and recommendations.

    technique:
      chainOfThought:
        steps:
          - name: Parse
            text: Understand the data structure
          - name: Analyze
            text: Identify patterns and anomalies
          - name: Conclude
            text: Summarize findings

    constraints:
      maxTokens: 2000
      temperature: 0.5
      model: gpt-4o

    output:
      format: markdown
    ```

## Best Practices

### When to Use .prompt

- Complex prompts with multiple sections
- Team has programming background
- Need concise, readable syntax
- Using version control (better diffs)

### When to Use YAML

- Simple configuration-style prompts
- Non-programmers editing prompts
- Integration with YAML-based tooling
- Prefer explicit structure

### General Tips

1. **Be consistent** - Pick one format per project
2. **Use interpolation** - `${params.x}` works in both
3. **Validate early** - Parse prompts at startup
4. **Version control** - Both formats diff well
