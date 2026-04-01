# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Setup and Dependencies:**
```bash
npm install                    # Install all dependencies
```

**Development Workflow:**
```bash
npm test                       # Run all tests (Jest)
npm run lint                   # Lint source code (ESLint)
npm run lint -- --fix         # Auto-fix linting issues
```

**Testing Specific Components:**
```bash
# Run specific test files
npx jest tests/parser.test.js
npx jest tests/executor.test.js

# Run integration tests
node examples/tests/test_harmony.js
node examples/tests/test_simple_conversion.js
```

**CLI Usage:**
```bash
# Execute prompts (both .prompt and .yml formats supported)
node src/cli.js -f examples/simple_harmony.prompt -p openai -k $API_KEY --params '{"question":"test"}'
node src/cli.js -f examples/simple_harmony.yml -p openai -k $API_KEY --params '{"question":"test"}'

# Convert between formats
node src/cli.js --convert yaml -f examples/simple_harmony.prompt
node src/cli.js --convert prompt -f examples/simple_harmony.yml
```

## Architecture Overview

Promptel is a declarative prompt engineering framework with **dual format support** (.prompt and .yml) and **native Harmony Protocol integration**. The architecture follows a clear pipeline:

**Core Pipeline:**
```
Input (.prompt/.yml) → Parser → AST → Executor → Provider → LLM → Response Parser → Output
```

**Key Components:**

1. **Dual Parsers:**
   - `src/parser.js`: Chevrotain-based parser for native .prompt declarative syntax
   - `src/yaml-parser.js`: YAML parser that converts YAML to equivalent AST
   - `src/format-converter.js`: Bidirectional conversion between formats with automatic detection

2. **Execution Engine:**
   - `src/executor.js`: Core execution engine with Harmony Protocol integration via `harmony-protocol-js`
   - Handles both standard and multi-channel (Harmony) response formats
   - Manages execution context including params, techniques, constraints, hooks

3. **Provider Abstraction:**
   - `src/provider.js`: Multi-provider adapter supporting OpenAI, Anthropic, Groq
   - Abstracts API differences while leveraging provider-specific capabilities
   - Environment variable-based configuration with `PROMPTEL_API_KEY`

4. **Universal API:**
   - `src/index.js`: Provides unified interface supporting both formats automatically
   - `parsePrompt()`: Auto-detects and parses either .prompt or .yml format
   - `executePrompt()`: End-to-end execution from content to results

**Format Equivalency:**
Both `.prompt` and `.yml` formats compile to identical ASTs and support full feature parity:
- Meta information, Harmony Protocol configuration, parameters with types/defaults
- Techniques (Chain-of-Thought, Tree-of-Thoughts, ReAct), constraints, output schemas
- Hooks for pre/post processing, template interpolation

**Harmony Protocol Integration:**
- Native support for OpenAI's gpt-oss models with multi-channel responses
- Automatic parsing of `final`, `analysis`, `commentary` channels
- Built-in reasoning effort levels and channel routing
- First Node.js framework to support Harmony Protocol natively

**Testing Strategy:**
- Unit tests in `tests/` cover parser and executor components
- Integration tests in `examples/tests/` verify Harmony Protocol and format conversion
- Mock providers prevent actual API calls during testing
- Jest configuration handles ES modules from `harmony-protocol-js` dependency

**Example Structure:**
- `examples/` contains equivalent prompts in both formats for comparison
- Harmony Protocol examples demonstrate multi-channel response handling
- Integration test scripts validate format conversion and execution compatibility

The codebase emphasizes format flexibility, provider abstraction, and advanced AI capabilities while maintaining clean separation of concerns between parsing, execution, and provider interaction.