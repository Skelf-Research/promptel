# Advanced Examples

Complex examples showcasing Promptel's advanced features.

## Chain-of-Thought Math Solver

Step-by-step mathematical problem solving:

```javascript
prompt MathSolver {
  params {
    problem: string
  }

  body {
    text`Solve this math problem: ${params.problem}`
  }

  technique {
    chainOfThought {
      step("Understand") {
        text`Read the problem and identify:
- What is being asked
- What information is given
- What formulas or concepts apply`
      }
      step("Plan") {
        text`Outline the solution approach:
- List the steps needed
- Identify any intermediate calculations`
      }
      step("Execute") {
        text`Solve step by step:
- Show each calculation
- Keep track of units
- Simplify where possible`
      }
      step("Verify") {
        text`Check the answer:
- Does it make sense?
- Can you verify with a different method?
- Are units correct?`
      }
    }
  }

  constraints {
    maxTokens: 1500
    temperature: 0.3
  }
}
```

## Harmony Protocol Analysis

Multi-channel response for complex analysis:

```javascript
prompt HarmonyAnalyzer {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis", "commentary"]
  }

  params {
    topic: string
    context?: string
  }

  body {
    text`Provide a comprehensive analysis of: ${params.topic}

${params.context ? `Additional context: ${params.context}` : ''}`
  }

  constraints {
    maxTokens: 2000
    temperature: 0.7
    model: "gpt-4o"
  }
}
```

**Usage:**

```javascript
const result = await executePrompt(analyzerPrompt, {
  topic: "Impact of remote work on team productivity",
  context: "Focus on software development teams"
});

// Access different channels
console.log("Summary:", result.channels.final);
console.log("Detailed Analysis:", result.channels.analysis);
console.log("Caveats:", result.channels.commentary);
```

## Code Review with Reasoning

Comprehensive code review using Chain-of-Thought with Harmony:

```javascript
prompt CodeReviewer {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }

  params {
    code: string
    language: string
    focus?: string = "all"
  }

  body {
    text`Review this ${params.language} code:

\`\`\`${params.language}
${params.code}
\`\`\`

Focus area: ${params.focus}`
  }

  technique {
    chainOfThought {
      step("Security") {
        text`Check for security vulnerabilities:
- Input validation
- Injection risks
- Authentication/authorization issues
- Data exposure`
      }
      step("Bugs") {
        text`Identify potential bugs:
- Logic errors
- Edge cases
- Null/undefined handling
- Type issues`
      }
      step("Performance") {
        text`Analyze performance:
- Algorithm complexity
- Memory usage
- Unnecessary operations
- Caching opportunities`
      }
      step("Maintainability") {
        text`Evaluate code quality:
- Readability
- Documentation
- Naming conventions
- SOLID principles`
      }
    }
  }

  constraints {
    maxTokens: 2500
    temperature: 0.3
    model: "gpt-4o"
  }
}
```

## Tree-of-Thoughts Problem Solving

Explore multiple solution approaches:

```javascript
prompt ProblemSolver {
  params {
    problem: string
    constraints?: string
  }

  body {
    text`Find the best solution for: ${params.problem}

${params.constraints ? `Constraints: ${params.constraints}` : ''}`
  }

  technique {
    treeOfThoughts {
      branches: 3
      depth: 2
      evaluation: "score"

      thought("Direct Approach") {
        text`Consider the most straightforward solution.
What's the simplest way to solve this?`
      }
      thought("Decomposition") {
        text`Break the problem into smaller subproblems.
Can we solve parts independently?`
      }
      thought("Alternative Framing") {
        text`Reframe the problem differently.
Is there a non-obvious angle to approach this?`
      }
    }
  }

  constraints {
    maxTokens: 2000
    temperature: 0.8
  }
}
```

## ReAct Research Agent

Reasoning and acting for research tasks:

```javascript
prompt ResearchAgent {
  params {
    question: string
    sources?: string
  }

  body {
    text`Research and answer: ${params.question}

${params.sources ? `Available sources: ${params.sources}` : ''}`
  }

  technique {
    reAct {
      thought {
        text`Think about what information is needed to answer this question.
What do I already know? What do I need to find out?`
      }
      action {
        text`Decide on an action:
- SEARCH: Look for specific information
- ANALYZE: Process available data
- CONCLUDE: Form a conclusion`
      }
      observation {
        text`Process the results of the action.
What did I learn? Does this answer the question?
If not, what else do I need?`
      }
    }
  }

  constraints {
    maxTokens: 1500
    temperature: 0.5
  }
}
```

## Few-Shot Classification with Confidence

Classification with calibrated confidence:

```javascript
prompt ClassifierWithConfidence {
  params {
    text: string
    categories: string
  }

  body {
    text`Classify the following text into one of these categories: ${params.categories}

Text: "${params.text}"

Provide your classification and confidence level (0-100%).`
  }

  technique {
    fewShot {
      example {
        input: "Just received my order, quality is amazing!"
        output: "Category: Product Review - Positive\nConfidence: 95%"
      }
      example {
        input: "When will the new version be released?"
        output: "Category: Product Inquiry\nConfidence: 90%"
      }
      example {
        input: "I need to speak with a manager about my refund"
        output: "Category: Customer Support - Escalation\nConfidence: 85%"
      }
    }

    selfConsistency {
      samples: 3
      aggregation: "majority"
    }
  }

  constraints {
    temperature: 0.3
  }
}
```

## Multi-Step Document Processing

Process documents through multiple stages:

```javascript
prompt DocumentProcessor {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }

  params {
    document: string
    task: string
  }

  body {
    text`Process this document according to the task.

Document:
${params.document}

Task: ${params.task}`
  }

  technique {
    chainOfThought {
      step("Extract") {
        text`Extract key information:
- Main topics
- Important entities
- Key facts and figures`
      }
      step("Analyze") {
        text`Analyze the content:
- Relationships between concepts
- Patterns and trends
- Gaps or inconsistencies`
      }
      step("Transform") {
        text`Transform according to task:
- Apply requested processing
- Format appropriately
- Ensure completeness`
      }
      step("Validate") {
        text`Validate the output:
- Check accuracy
- Verify completeness
- Ensure task requirements met`
      }
    }
  }

  constraints {
    maxTokens: 3000
    temperature: 0.4
  }
}
```

## API Design Assistant

Generate API designs with reasoning:

```javascript
prompt APIDesigner {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis", "commentary"]
  }

  params {
    requirements: string
    style?: string = "REST"
  }

  body {
    text`Design a ${params.style} API based on these requirements:

${params.requirements}

Provide endpoint definitions, request/response schemas, and design rationale.`
  }

  technique {
    chainOfThought {
      step("Resources") {
        text`Identify the core resources and their relationships`
      }
      step("Operations") {
        text`Define CRUD and custom operations for each resource`
      }
      step("Schemas") {
        text`Design request and response schemas`
      }
      step("Authentication") {
        text`Plan authentication and authorization`
      }
    }
  }

  constraints {
    maxTokens: 2500
    temperature: 0.5
    model: "gpt-4o"
  }
}
```

## Complete YAML Example

The same advanced prompt in YAML format:

```yaml
name: AdvancedAnalyzer

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
  depth:
    type: string
    required: false
    default: "thorough"
  format:
    type: string
    required: false
    default: "markdown"

body:
  text: |
    Analyze the following with ${params.depth} depth:

    ${params.input}

    Format the response as ${params.format}.

technique:
  chainOfThought:
    steps:
      - name: Understand
        text: Comprehend the input and identify key elements
      - name: Analyze
        text: Perform deep analysis of patterns and relationships
      - name: Synthesize
        text: Combine insights into coherent findings
      - name: Present
        text: Format results according to requirements

constraints:
  maxTokens: 2000
  temperature: 0.6
  model: gpt-4o

output:
  format: markdown
```

## Running Advanced Examples

```bash
# Save prompt to file
cat > analyzer.prompt << 'EOF'
prompt HarmonyAnalyzer {
  harmony {
    reasoning: "high"
    channels: ["final", "analysis"]
  }
  params { topic: string }
  body { text`Analyze: ${params.topic}` }
}
EOF

# Execute with Harmony
promptel -f analyzer.prompt -p openai -k $OPENAI_API_KEY \
  --params '{"topic":"quantum computing applications"}'
```

## Best Practices

1. **Match technique to task** - Use CoT for step-by-step, ToT for exploration
2. **Leverage Harmony channels** - Separate user content from reasoning
3. **Combine techniques** - CoT + Self-Consistency for reliable complex tasks
4. **Set appropriate constraints** - Lower temperature for factual, higher for creative
5. **Use specific models** - GPT-4 class for complex reasoning tasks

## Next Steps

- [Techniques Deep Dive](../guides/techniques.md)
- [Harmony Protocol Guide](../guides/harmony.md)
- [API Reference](../reference/api.md)
