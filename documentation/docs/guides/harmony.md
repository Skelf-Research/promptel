# Harmony Protocol

Promptel is the first Node.js framework with native support for OpenAI's Harmony Protocol, enabling multi-channel responses with structured reasoning.

## What is Harmony Protocol?

Harmony Protocol allows LLMs to provide responses across multiple channels:

- **final** - The clean, user-facing answer
- **analysis** - Detailed reasoning process
- **commentary** - Meta-observations and alternatives

This separation enables sophisticated reasoning without cluttering the main response.

## Basic Usage

Enable Harmony in your prompt:

```javascript
prompt HarmonyExample {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis", "commentary"]
  }

  params {
    question: string
  }

  body {
    text`${params.question}`
  }
}
```

Execute and access channels:

```javascript
const { executePrompt } = require('promptel');

const result = await executePrompt(harmonyPrompt, {
  question: "Explain quantum entanglement"
});

console.log(result.channels.final);      // Clean explanation
console.log(result.channels.analysis);   // Reasoning steps
console.log(result.channels.commentary); // Additional context
```

## Configuration Options

### Reasoning Effort

Control how much reasoning the model performs:

```javascript
harmony {
  reasoning: "low"     // Quick responses
  reasoning: "medium"  // Balanced (default)
  reasoning: "high"    // Deep analysis
}
```

### Channel Selection

Choose which channels to receive:

```javascript
harmony {
  channels: ["final"]                    // Just the answer
  channels: ["final", "analysis"]        // Answer + reasoning
  channels: ["final", "analysis", "commentary"]  // Full output
}
```

## Response Structure

Harmony responses include metadata:

```javascript
{
  success: true,
  channels: {
    final: "Quantum entanglement is...",
    analysis: "Breaking down the concept:\n1. First...",
    commentary: "Note: This explanation simplifies..."
  },
  metadata: {
    reasoning: "high",
    totalMessages: 3,
    assistantMessages: 1
  }
}
```

## Real-World Examples

### Code Review with Reasoning

```javascript
prompt CodeReview {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }

  params {
    code: string
  }

  body {
    text`Review this code for bugs and improvements:

\`\`\`
${params.code}
\`\`\`
`
  }
}
```

The response provides:
- **final**: Actionable review summary
- **analysis**: Detailed bug analysis and reasoning

### Decision Support

```javascript
prompt DecisionHelper {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis", "commentary"]
  }

  params {
    options: string
    context: string
  }

  body {
    text`Help decide between: ${params.options}

Context: ${params.context}`
  }
}
```

Response channels:
- **final**: Recommended decision
- **analysis**: Pros/cons evaluation
- **commentary**: Uncertainties and alternatives

### Math Problem Solving

```javascript
prompt MathSolver {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }

  params {
    problem: string
  }

  body {
    text`Solve: ${params.problem}`
  }

  technique {
    chainOfThought {
      step("Understand") { text`Parse the problem` }
      step("Solve") { text`Work through solution` }
      step("Verify") { text`Check the answer` }
    }
  }
}
```

## YAML Format

```yaml
name: HarmonyAnalysis

harmony:
  reasoning: high
  channels:
    - final
    - analysis
    - commentary

params:
  input:
    type: string
    required: true

body:
  text: "Analyze: ${params.input}"
```

## Combining with Techniques

Harmony works with all prompting techniques:

```javascript
prompt AdvancedReasoning {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }

  params {
    problem: string
  }

  body {
    text`${params.problem}`
  }

  technique {
    chainOfThought {
      step("Decompose") { text`Break into parts` }
      step("Analyze") { text`Study each part` }
      step("Synthesize") { text`Combine insights` }
    }
  }
}
```

The Chain-of-Thought steps appear in the `analysis` channel while the final answer goes to `final`.

## Provider Support

| Provider | Harmony Support |
|----------|-----------------|
| OpenAI | Full support |
| Anthropic | Not supported |
| Groq | Not supported |

!!! warning "Provider Compatibility"
    Harmony Protocol is currently only supported by OpenAI. Using Harmony with other providers will fall back to standard response format.

## Best Practices

### When to Use Harmony

- Complex analysis tasks
- Decision support systems
- Educational explanations
- Debugging and troubleshooting
- Research assistance

### When Not to Use Harmony

- Simple Q&A
- Creative writing
- Quick lookups
- Non-OpenAI providers

### Channel Selection Tips

| Use Case | Recommended Channels |
|----------|---------------------|
| User-facing app | `["final"]` |
| Developer tools | `["final", "analysis"]` |
| Research/audit | `["final", "analysis", "commentary"]` |

### Reasoning Level Tips

| Use Case | Recommended Level |
|----------|-------------------|
| Quick answers | `low` |
| General tasks | `medium` |
| Complex problems | `high` |
| Critical decisions | `high` |

## Error Handling

```javascript
const result = await executePrompt(harmonyPrompt, params);

if (!result.success) {
  console.error('Harmony execution failed');
  return;
}

// Safely access channels
const answer = result.channels?.final || 'No response';
const reasoning = result.channels?.analysis || '';
```

## Next Steps

- [Techniques](techniques.md) - Combine with reasoning techniques
- [API Reference](../reference/api.md) - Full API documentation
- [Examples](../examples/advanced.md) - More Harmony examples
