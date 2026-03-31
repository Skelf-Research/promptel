# Promptel Harmony Integration Design

## Overview
This document outlines the design for integrating OpenAI's Harmony response format into Promptel, making it the first Node.js framework to provide native Harmony support.

## Syntax Extensions

### 1. Format Specification
```nudgelang
prompt HarmonyExample {
  meta {
    name: "Advanced Reasoning Prompt";
    version: "2.0";
    format: "harmony";  // NEW: Specifies Harmony format
  }

  // NEW: Harmony-specific configuration
  harmony {
    encoding: "harmony_gpt_oss";  // Encoding to use
    reasoning: "high";            // low/medium/high reasoning effort
    channels: ["final", "analysis", "commentary"];
  }
}
```

### 2. Multi-Channel Output Definition
```nudgelang
prompt MultiChannelReasoning {
  format: "harmony";

  output {
    channels {
      final: {
        format: "json";
        schema: {
          solution: string,
          confidence: number
        }
      };
      analysis: {
        format: "text";
        description: "Chain of thought reasoning";
      };
      commentary: {
        format: "structured";
        schema: {
          tool_calls: object[],
          metadata: object
        }
      };
    }
  }
}
```

### 3. Enhanced Technique Support
```nudgelang
prompt AdvancedCoT {
  format: "harmony";

  technique {
    chainOfThought {
      reasoning: "high";
      channels {
        analysis: "detailed step-by-step reasoning";
        commentary: "tool usage and verification";
        final: "concise final answer";
      };

      step("Problem Understanding") {
        channel: "analysis";
        text`Analyze the problem and identify key components`;
      }
      step("Solution Planning") {
        channel: "analysis";
        text`Develop a strategy for solving this problem`;
      }
      step("Execution") {
        channel: "analysis";
        text`Execute the plan with detailed reasoning`;
      }
      step("Verification") {
        channel: "commentary";
        text`Verify the solution using alternative methods`;
      }
    }
  }
}
```

### 4. Cross-Provider Harmony Abstraction
```nudgelang
prompt UniversalReasoning {
  // Automatically maps to provider capabilities
  format: "adaptive";  // NEW: Auto-detects best format per provider

  technique {
    chainOfThought {
      reasoning: "adaptive";  // Maps to provider capabilities

      // Provider-specific channel mapping
      channels {
        openai: {
          analysis: "analysis",     // Harmony channel
          final: "final"
        };
        anthropic: {
          analysis: "thinking",     // Claude's thinking tags
          final: "content"
        };
        groq: {
          analysis: "reasoning",    // Custom implementation
          final: "response"
        };
      }
    }
  }
}
```

### 5. Advanced Reasoning Controls
```nudgelang
prompt DynamicReasoning {
  format: "harmony";

  params {
    problem_complexity: string;  // "simple" | "medium" | "complex"
    reasoning_mode: string = "adaptive";
  }

  body {
    // Dynamic reasoning effort based on complexity
    if (params.problem_complexity === "complex") {
      reasoning: "high";
      channels: ["final", "analysis", "commentary"];
    } else if (params.problem_complexity === "medium") {
      reasoning: "medium";
      channels: ["final", "analysis"];
    } else {
      reasoning: "low";
      channels: ["final"];
    }
  }
}
```

## Implementation Architecture

### 1. Parser Extensions
- Add `Format`, `Harmony`, `Channels`, `Reasoning` tokens
- Extend `outputSection` to handle channel definitions
- Add `harmonySection` parsing rules

### 2. Executor Enhancements
- Create `HarmonyProvider` class
- Implement Node.js bindings to harmony format (initially via subprocess to Python)
- Add multi-channel output handling
- Extend technique handlers for channel-aware execution

### 3. Provider Abstraction
- Extend base `ProviderInterface` with Harmony support
- Create provider capability detection
- Implement fallback strategies for non-Harmony providers

### 4. New Dependencies
```json
{
  "dependencies": {
    "node-python-bridge": "^1.1.2",  // For initial Python harmony bridge
    "child_process": "^1.0.2"        // For spawning Python processes
  }
}
```

## Example Usage

### Input Promptel File
```nudgelang
prompt MathSolverHarmony {
  meta {
    name: "Math Problem Solver with Harmony";
    version: "2.0";
  }

  format: "harmony";

  harmony {
    reasoning: "high";
    channels: ["final", "analysis", "commentary"];
  }

  params {
    problem: string;
  }

  technique {
    chainOfThought {
      channels {
        analysis: "detailed mathematical reasoning";
        commentary: "calculation verification and tool usage";
        final: "clean solution with answer";
      };

      step("Understand") {
        channel: "analysis";
        text`Analyze the mathematical problem: ${params.problem}`;
      }

      step("Solve") {
        channel: "analysis";
        text`Show step-by-step solution with calculations`;
      }

      step("Verify") {
        channel: "commentary";
        text`Double-check calculations using alternative method`;
      }
    }
  }

  output {
    channels {
      final: {
        format: "json";
        schema: {
          answer: number,
          explanation: string
        }
      };
      analysis: {
        format: "text";
        description: "Complete reasoning chain"
      };
      commentary: {
        format: "structured";
        schema: {
          verification: string,
          alternative_methods: string[]
        }
      };
    }
  }
}
```

### JavaScript Execution
```javascript
import { PromptelParser, PromptelExecutor } from 'promptel';

const parser = new PromptelParser();
const executor = new PromptelExecutor('openai', apiKey);

const ast = parser.parse(promptelCode);
const result = await executor.execute(ast, {
  problem: "What is the derivative of x^2 + 3x + 2?"
});

// Access multi-channel outputs
console.log('Final Answer:', result.channels.final);
console.log('Reasoning:', result.channels.analysis);
console.log('Verification:', result.channels.commentary);

// Traditional single output still works
console.log('Legacy Output:', result.output);
```

## Migration Strategy

### Phase 1: Core Harmony Support (Week 1-2)
1. Parser extensions for format and harmony sections
2. Basic Harmony provider using Python subprocess
3. Multi-channel output handling

### Phase 2: Advanced Features (Week 3-4)
1. Cross-provider abstraction
2. Dynamic reasoning effort
3. Enhanced technique handlers

### Phase 3: Optimization (Week 5-6)
1. Native Node.js Harmony implementation (if possible)
2. Performance optimizations
3. Comprehensive testing

## Competitive Advantages

1. **First Node.js Harmony Support**: No other framework provides this
2. **Declarative Syntax**: Much simpler than direct harmony library usage
3. **Cross-Provider**: Works with multiple LLM providers
4. **Backward Compatible**: Existing prompts continue to work
5. **Future-Proof**: Ready for Harmony adoption by other providers

## Success Metrics

- Support for all Harmony format features
- 10x simpler syntax than direct harmony usage
- Zero breaking changes to existing prompts
- Performance within 20% of direct harmony calls
- Community adoption and GitHub stars