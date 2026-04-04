# Language Specification

Complete reference for the Promptel .prompt language syntax.

## Grammar Overview

```
Program        → Prompt*
Prompt         → 'prompt' Identifier '{' Section* '}'
Section        → MetaSection | HarmonySection | ContextSection |
                 ParamsSection | BodySection | TechniqueSection |
                 ConstraintsSection | OutputSection | HooksSection
```

## Prompt Declaration

Every prompt starts with the `prompt` keyword followed by a name:

```javascript
prompt MyPrompt {
  // sections here
}
```

**Rules:**
- Name must be a valid identifier (alphanumeric + underscore, not starting with number)
- PascalCase is conventional
- File can contain multiple prompts

## Sections

### meta

Metadata about the prompt.

```javascript
meta {
  name: "Human-readable name";
  version: "1.0.0";
  author: "Your Name";
  description: "What this prompt does";
}
```

**Field types:** All values are strings.

### harmony

Harmony Protocol configuration for multi-channel responses.

```javascript
harmony {
  reasoning: "high"           // "low" | "medium" | "high"
  channels: ["final", "analysis", "commentary"]
  encoding: "default"         // optional
}
```

**Fields:**

| Field | Type | Values |
|-------|------|--------|
| `reasoning` | string | `"low"`, `"medium"`, `"high"` |
| `channels` | array | `"final"`, `"analysis"`, `"commentary"` |
| `encoding` | string | `"default"` |

### context

System context and role definition.

```javascript
context {
  role: "You are an expert programmer";
  background: "Additional context here";
  system: "System-level instructions";
}
```

### params

Input parameter definitions with types and defaults.

```javascript
params {
  required: string                    // Required string
  optional?: number                   // Optional number
  withDefault: string = "default"     // With default value
  typed: boolean                      // Boolean type
  enumLike: "a" | "b" | "c"          // Union type (future)
}
```

**Syntax:**

```
ParamField → Identifier ['?'] ':' Type ['=' DefaultValue] ';'
```

**Supported types:**
- `string` - Text
- `number` - Numeric
- `boolean` - True/false
- `object` - JSON object
- `array` - JSON array

### body

Main prompt content with text blocks.

```javascript
body {
  text`Your prompt text here`

  text`Multiline text
  continues here
  with ${params.interpolation}`
}
```

**Text interpolation:**

```javascript
body {
  text`Hello ${params.name}!`
  text`The value is: ${params.count}`
}
```

**Control flow (planned):**

```javascript
body {
  if (params.verbose) {
    text`Detailed output enabled`
  }

  for item in params.items {
    text`- ${item}`
  }
}
```

### technique

Reasoning technique configuration.

#### Chain-of-Thought

```javascript
technique {
  chainOfThought {
    step("StepName") {
      text`Instructions for this step`
    }
    step("NextStep") {
      text`Next step instructions`
    }
  }
}
```

#### Few-Shot

```javascript
technique {
  fewShot {
    example {
      input: "Example input"
      output: "Expected output"
    }
    example {
      input: "Another input"
      output: "Another output"
    }
  }
}
```

#### Zero-Shot

```javascript
technique {
  zeroShot {
    instruction: "Direct instruction text"
  }
}
```

#### Tree-of-Thoughts

```javascript
technique {
  treeOfThoughts {
    branches: 3
    depth: 2
    evaluation: "score"
    thought("Approach") {
      text`Explore this approach`
    }
  }
}
```

#### ReAct

```javascript
technique {
  reAct {
    thought { text`Reasoning step` }
    action { text`Action to take` }
    observation { text`Process result` }
  }
}
```

#### Self-Consistency

```javascript
technique {
  selfConsistency {
    samples: 5
    aggregation: "majority"
  }
}
```

### constraints

LLM generation parameters.

```javascript
constraints {
  maxTokens: 1000
  temperature: 0.7
  topP: 0.9
  frequencyPenalty: 0.0
  presencePenalty: 0.0
  model: "gpt-4o"
}
```

**Available constraints:**

| Constraint | Type | Range | Description |
|------------|------|-------|-------------|
| `maxTokens` | number | 1-∞ | Max response length |
| `temperature` | number | 0-2 | Randomness |
| `topP` | number | 0-1 | Nucleus sampling |
| `frequencyPenalty` | number | -2-2 | Reduce repetition |
| `presencePenalty` | number | -2-2 | Encourage diversity |
| `model` | string | - | Model identifier |

### output

Output format specification.

```javascript
output {
  format: "json"
  schema: {
    type: "object"
    properties: {
      result: { type: "string" }
      confidence: { type: "number" }
    }
  }
}
```

### hooks

Pre and post processing hooks.

```javascript
hooks {
  preProcess {
    // Transform input before execution
    return input.trim();
  }

  postProcess {
    // Transform output after execution
    return JSON.parse(output);
  }
}
```

## Literals

### Strings

```javascript
"Double quoted string"
'Single quoted string'
```

### Numbers

```javascript
42
3.14
-10
```

### Booleans

```javascript
true
false
```

### Arrays

```javascript
[1, 2, 3]
["a", "b", "c"]
["mixed", 123, true]
```

### Objects

```javascript
{
  key: "value"
  nested: {
    inner: 42
  }
}
```

## Expressions

### Property Access

```javascript
params.name
params.nested.value
```

### Template Interpolation

```javascript
text`Hello ${params.name}!`
text`Count: ${params.items.length}`
```

## Comments

```javascript
// Single line comment

prompt Example {
  // Comment inside prompt
  body {
    text`Content` // Inline comment
  }
}
```

## Reserved Words

```
prompt, meta, harmony, context, params, body, technique,
constraints, output, hooks, if, else, for, in, true, false,
null, chainOfThought, fewShot, zeroShot, treeOfThoughts,
reAct, selfConsistency, step, example, thought, text
```

## Complete Example

```javascript
// Full-featured prompt example
prompt CompleteExample {
  meta {
    name: "Complete Example";
    version: "1.0.0";
    description: "Demonstrates all language features";
  }

  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }

  context {
    role: "You are a helpful assistant";
  }

  params {
    input: string
    mode?: string = "default"
    verbose?: boolean = false
  }

  body {
    text`Process the following input in ${params.mode} mode:

${params.input}

Please provide a thorough analysis.`
  }

  technique {
    chainOfThought {
      step("Understand") {
        text`First, understand the input`
      }
      step("Analyze") {
        text`Then, analyze the content`
      }
      step("Respond") {
        text`Finally, formulate a response`
      }
    }
  }

  constraints {
    maxTokens: 2000
    temperature: 0.7
    model: "gpt-4o"
  }

  output {
    format: "markdown"
  }
}
```

## YAML Equivalence

Every .prompt construct has a YAML equivalent. See the [Format Guide](../guides/formats.md) for complete mappings.
