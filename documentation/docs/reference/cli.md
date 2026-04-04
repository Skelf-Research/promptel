# CLI Reference

The Promptel CLI provides command-line access to execute prompts and convert between formats.

## Installation

```bash
# Global installation
npm install -g promptel

# Or use via npx
npx promptel --help
```

## Commands

### Execute a Prompt

```bash
promptel -f <file> -p <provider> -k <api-key> [options]
```

**Required flags:**

| Flag | Description |
|------|-------------|
| `-f, --file <path>` | Path to prompt file (.prompt or .yml) |
| `-p, --provider <type>` | Provider: `openai`, `groq`, or `claude` |
| `-k, --api-key <key>` | API key for the provider |

**Optional flags:**

| Flag | Description |
|------|-------------|
| `--params <json>` | JSON string of parameters |
| `-o, --output <path>` | Write result to file |
| `--format <format>` | Force input format detection |

**Examples:**

```bash
# Basic execution
promptel -f prompt.prompt -p openai -k $OPENAI_API_KEY

# With parameters
promptel -f solver.prompt -p openai -k $KEY --params '{"problem":"2+2"}'

# Save output to file
promptel -f prompt.yml -p claude -k $KEY -o result.json

# Force format detection
promptel -f ambiguous.txt -p groq -k $KEY --format yaml
```

### Convert Formats

```bash
promptel --convert <format> -f <file> [-o <output>]
```

**Arguments:**

| Flag | Description |
|------|-------------|
| `--convert <format>` | Target format: `prompt` or `yaml` |
| `-f, --file <path>` | Source file to convert |
| `-o, --output <path>` | Output file (prints to stdout if omitted) |

**Examples:**

```bash
# Convert .prompt to YAML
promptel --convert yaml -f math_solver.prompt

# Convert YAML to .prompt with output file
promptel --convert prompt -f config.yml -o config.prompt

# Convert and save
promptel --convert yaml -f solver.prompt -o solver.yml
```

### Help and Version

```bash
# Show help
promptel --help

# Show version
promptel --version
```

## Usage Examples

### Simple Prompt Execution

```bash
# Create a prompt file
cat > greeting.prompt << 'EOF'
prompt Greeting {
  params {
    name: string
  }
  body {
    text`Say hello to ${params.name}`
  }
}
EOF

# Execute it
promptel -f greeting.prompt -p openai -k $OPENAI_API_KEY \
  --params '{"name":"World"}'
```

### YAML Prompt Execution

```bash
# Create a YAML prompt
cat > greeting.yml << 'EOF'
name: Greeting
params:
  name:
    type: string
    required: true
body:
  text: "Say hello to ${params.name}"
EOF

# Execute it
promptel -f greeting.yml -p openai -k $OPENAI_API_KEY \
  --params '{"name":"World"}'
```

### Complex Parameters

```bash
# Nested JSON parameters
promptel -f analyzer.prompt -p openai -k $KEY \
  --params '{"data":{"items":[1,2,3]},"options":{"verbose":true}}'
```

### Batch Processing

```bash
# Process multiple prompts
for file in prompts/*.prompt; do
  promptel -f "$file" -p openai -k $KEY -o "results/$(basename $file .prompt).json"
done
```

### Using Environment Variables

```bash
# Set environment variables
export PROMPTEL_API_KEY=sk-your-key
export PROMPTEL_PROVIDER=openai

# Execute (still need -p and -k flags in current version)
promptel -f prompt.prompt -p $PROMPTEL_PROVIDER -k $PROMPTEL_API_KEY
```

## Output Formats

### Console Output

By default, results print to stdout:

```bash
promptel -f prompt.prompt -p openai -k $KEY
# Output:
# Result:
# {
#   "response": "Hello, World!"
# }
```

### File Output

Use `-o` to save to a file:

```bash
promptel -f prompt.prompt -p openai -k $KEY -o result.json
# Output:
# Result written to result.json
```

### Harmony Protocol Output

Harmony responses include channel data:

```bash
promptel -f harmony.prompt -p openai -k $KEY
# Output:
# Result:
# {
#   "success": true,
#   "channels": {
#     "final": "...",
#     "analysis": "..."
#   },
#   "metadata": {
#     "reasoning": "high"
#   }
# }
```

## Error Handling

### Missing Required Flags

```bash
promptel -f prompt.prompt
# Error: Provider (-p) and API key (-k) are required for prompt execution
```

### Invalid File

```bash
promptel -f nonexistent.prompt -p openai -k $KEY
# Error: ENOENT: no such file or directory
```

### Invalid JSON Parameters

```bash
promptel -f prompt.prompt -p openai -k $KEY --params 'invalid'
# Error: Unexpected token 'i'
```

### Invalid Convert Format

```bash
promptel --convert xml -f prompt.prompt
# Error: Convert format must be either "prompt" or "yaml"
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (invalid arguments, execution failure, etc.) |

## Tips

1. **Quote JSON parameters** - Always use single quotes around JSON
2. **Use environment variables** - Keep API keys out of command history
3. **Check format detection** - Use `--format` if auto-detection fails
4. **Redirect output** - Use `-o` or shell redirection for scripting

## Related

- [API Reference](api.md) - Programmatic usage
- [Format Guide](../guides/formats.md) - .prompt vs YAML
