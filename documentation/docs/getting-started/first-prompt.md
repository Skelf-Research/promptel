# Your First Prompt

Learn the anatomy of a Promptel prompt and build a real-world example.

## Prompt Structure

Every Promptel prompt has a consistent structure:

```
prompt PromptName {
  meta { ... }        // Optional: metadata
  harmony { ... }     // Optional: Harmony Protocol config
  params { ... }      // Optional: input parameters
  body { ... }        // Required: main prompt content
  technique { ... }   // Optional: reasoning techniques
  constraints { ... } // Optional: generation parameters
  output { ... }      // Optional: output format
  hooks { ... }       // Optional: pre/post processing
}
```

## Building a Code Reviewer

Let's build a practical code review assistant step by step.

### Step 1: Basic Structure

Start with the name and body:

```javascript
prompt CodeReviewer {
  body {
    text`Review the provided code for issues.`
  }
}
```

### Step 2: Add Parameters

Accept code and language as inputs:

```javascript
prompt CodeReviewer {
  params {
    code: string
    language: string = "javascript"
  }

  body {
    text`Review this ${params.language} code:

\`\`\`${params.language}
${params.code}
\`\`\`

Identify bugs, security issues, and improvements.`
  }
}
```

!!! note "Parameter Types"
    - `string` - Text input
    - `number` - Numeric values
    - `boolean` - True/false
    - Add `?` for optional: `option?: string`
    - Add `= value` for defaults: `lang: string = "js"`

### Step 3: Add Reasoning Technique

Use Chain-of-Thought for thorough analysis:

```javascript
prompt CodeReviewer {
  params {
    code: string
    language: string = "javascript"
  }

  body {
    text`Review this ${params.language} code:

\`\`\`${params.language}
${params.code}
\`\`\`
`
  }

  technique {
    chainOfThought {
      step("Security") {
        text`Check for security vulnerabilities`
      }
      step("Bugs") {
        text`Identify potential bugs and edge cases`
      }
      step("Performance") {
        text`Analyze performance implications`
      }
      step("Style") {
        text`Review code style and readability`
      }
    }
  }
}
```

### Step 4: Add Constraints

Control the generation:

```javascript
prompt CodeReviewer {
  params {
    code: string
    language: string = "javascript"
  }

  body {
    text`Review this ${params.language} code:

\`\`\`${params.language}
${params.code}
\`\`\`
`
  }

  technique {
    chainOfThought {
      step("Security") { text`Check for security vulnerabilities` }
      step("Bugs") { text`Identify potential bugs` }
      step("Performance") { text`Analyze performance` }
      step("Style") { text`Review code style` }
    }
  }

  constraints {
    maxTokens: 1000
    temperature: 0.3
    model: "gpt-4o"
  }
}
```

### Step 5: Execute It

```javascript
const { executePrompt } = require('promptel');

const codeReviewPrompt = `
prompt CodeReviewer {
  params {
    code: string
    language: string = "javascript"
  }

  body {
    text\`Review this \${params.language} code:

\\\`\\\`\\\`\${params.language}
\${params.code}
\\\`\\\`\\\`
\`
  }

  technique {
    chainOfThought {
      step("Security") { text\`Check for security vulnerabilities\` }
      step("Bugs") { text\`Identify potential bugs\` }
      step("Performance") { text\`Analyze performance\` }
      step("Style") { text\`Review code style\` }
    }
  }

  constraints {
    maxTokens: 1000
    temperature: 0.3
  }
}
`;

async function reviewCode(code, language = 'javascript') {
  const result = await executePrompt(codeReviewPrompt, {
    code,
    language
  });

  return result;
}

// Use it
const code = `
function processUser(data) {
  eval(data.script);
  return fetch('/api/user/' + data.id);
}
`;

reviewCode(code).then(console.log);
```

## YAML Equivalent

The same prompt in YAML:

```yaml
name: CodeReviewer

params:
  code:
    type: string
    required: true
  language:
    type: string
    default: "javascript"

body:
  text: |
    Review this ${params.language} code:

    ```${params.language}
    ${params.code}
    ```

technique:
  chainOfThought:
    steps:
      - name: Security
        text: Check for security vulnerabilities
      - name: Bugs
        text: Identify potential bugs
      - name: Performance
        text: Analyze performance
      - name: Style
        text: Review code style

constraints:
  maxTokens: 1000
  temperature: 0.3
```

## Key Concepts

| Concept | Purpose |
|---------|---------|
| `params` | Define typed inputs with defaults |
| `body` | Main prompt text with interpolation |
| `technique` | Structured reasoning methods |
| `constraints` | LLM generation parameters |
| `${...}` | Template interpolation |

## Next Steps

- [Format Guide](../guides/formats.md) - Deep dive into .prompt vs YAML
- [Techniques](../guides/techniques.md) - All available reasoning techniques
- [API Reference](../reference/api.md) - Full programmatic API
