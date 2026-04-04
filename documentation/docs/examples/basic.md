# Basic Examples

Simple, practical examples to get started with Promptel.

## Hello World

The simplest possible prompt:

=== ".prompt"

    ```javascript
    prompt HelloWorld {
      body {
        text`Say hello to the world in a friendly way.`
      }
    }
    ```

=== "YAML"

    ```yaml
    name: HelloWorld
    body:
      text: "Say hello to the world in a friendly way."
    ```

=== "JavaScript"

    ```javascript
    const { executePrompt } = require('promptel');

    const result = await executePrompt(`
    prompt HelloWorld {
      body { text\`Say hello to the world in a friendly way.\` }
    }
    `);

    console.log(result);
    ```

## With Parameters

Accept input parameters:

=== ".prompt"

    ```javascript
    prompt Greeter {
      params {
        name: string
        language?: string = "English"
      }

      body {
        text`Greet ${params.name} warmly in ${params.language}.`
      }
    }
    ```

=== "YAML"

    ```yaml
    name: Greeter

    params:
      name:
        type: string
        required: true
      language:
        type: string
        required: false
        default: "English"

    body:
      text: "Greet ${params.name} warmly in ${params.language}."
    ```

=== "JavaScript"

    ```javascript
    const result = await executePrompt(greeterPrompt, {
      name: "Alice",
      language: "Spanish"
    });
    ```

## Text Summarizer

Summarize text with constraints:

=== ".prompt"

    ```javascript
    prompt Summarizer {
      params {
        text: string
        sentences?: number = 3
      }

      body {
        text`Summarize the following text in ${params.sentences} sentences:

    ${params.text}

    Be concise and capture the main points.`
      }

      constraints {
        maxTokens: 200
        temperature: 0.5
      }
    }
    ```

=== "YAML"

    ```yaml
    name: Summarizer

    params:
      text:
        type: string
        required: true
      sentences:
        type: number
        default: 3

    body:
      text: |
        Summarize the following text in ${params.sentences} sentences:

        ${params.text}

        Be concise and capture the main points.

    constraints:
      maxTokens: 200
      temperature: 0.5
    ```

## Sentiment Analyzer

Classify sentiment with few-shot examples:

```javascript
prompt SentimentAnalyzer {
  params {
    text: string
  }

  body {
    text`Classify the sentiment of: "${params.text}"`
  }

  technique {
    fewShot {
      example {
        input: "I absolutely love this product!"
        output: "positive"
      }
      example {
        input: "This is the worst experience ever."
        output: "negative"
      }
      example {
        input: "It's okay, nothing special."
        output: "neutral"
      }
    }
  }

  constraints {
    maxTokens: 10
    temperature: 0
  }
}
```

**Usage:**

```javascript
const result = await executePrompt(sentimentPrompt, {
  text: "The service was excellent and staff were friendly!"
});
// Result: "positive"
```

## Code Explainer

Explain code in plain language:

```javascript
prompt CodeExplainer {
  params {
    code: string
    language?: string = "JavaScript"
    audience?: string = "beginner"
  }

  body {
    text`Explain this ${params.language} code for a ${params.audience}:

\`\`\`${params.language}
${params.code}
\`\`\`

Explain what it does, line by line if helpful.`
  }

  constraints {
    maxTokens: 500
    temperature: 0.3
  }
}
```

**Usage:**

```javascript
const result = await executePrompt(explainerPrompt, {
  code: `const sum = arr.reduce((a, b) => a + b, 0);`,
  language: "JavaScript",
  audience: "beginner"
});
```

## Email Writer

Generate professional emails:

```javascript
prompt EmailWriter {
  params {
    recipient: string
    subject: string
    keyPoints: string
    tone?: string = "professional"
  }

  body {
    text`Write a ${params.tone} email to ${params.recipient}.

Subject: ${params.subject}

Key points to cover:
${params.keyPoints}

The email should be clear, concise, and appropriate for business communication.`
  }

  constraints {
    maxTokens: 400
    temperature: 0.7
  }
}
```

## Question Answerer

Answer questions with context:

```javascript
prompt QABot {
  params {
    context: string
    question: string
  }

  body {
    text`Based on the following context, answer the question.

Context:
${params.context}

Question: ${params.question}

Answer based only on the information provided. If the answer isn't in the context, say "I don't have enough information to answer that."`
  }

  constraints {
    maxTokens: 300
    temperature: 0.3
  }
}
```

## Translation

Translate text between languages:

```javascript
prompt Translator {
  params {
    text: string
    sourceLang?: string = "auto"
    targetLang: string
  }

  body {
    text`Translate the following from ${params.sourceLang} to ${params.targetLang}:

${params.text}

Provide only the translation, preserving tone and meaning.`
  }

  constraints {
    temperature: 0.3
  }
}
```

## Data Formatter

Convert data between formats:

```javascript
prompt DataFormatter {
  params {
    data: string
    inputFormat: string
    outputFormat: string
  }

  body {
    text`Convert this ${params.inputFormat} to ${params.outputFormat}:

${params.data}

Output only the converted data, no explanation.`
  }

  constraints {
    temperature: 0
  }
}
```

**Usage:**

```javascript
const result = await executePrompt(formatterPrompt, {
  data: "name,age,city\nAlice,30,NYC\nBob,25,LA",
  inputFormat: "CSV",
  outputFormat: "JSON"
});
```

## CLI Examples

Run any of these from the command line:

```bash
# Create a prompt file
cat > summarizer.prompt << 'EOF'
prompt Summarizer {
  params {
    text: string
  }
  body {
    text`Summarize: ${params.text}`
  }
}
EOF

# Execute it
promptel -f summarizer.prompt -p openai -k $OPENAI_API_KEY \
  --params '{"text":"Your long text here..."}'
```

## Next Steps

- [Advanced Examples](advanced.md) - Chain-of-Thought, Harmony, and more
- [Techniques Guide](../guides/techniques.md) - Deep dive into techniques
- [API Reference](../reference/api.md) - Full programmatic API
