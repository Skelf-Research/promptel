/**
 * Promptel - Declarative prompt engineering framework with Harmony Protocol support.
 * @module promptel
 */

const PromptelParser = require('./parser');
const PromptelYamlParser = require('./yaml-parser');
const PromptelExecutor = require('./executor');
const { createProvider, ProviderInterface, OpenAIProvider, GroqProvider, ClaudeProvider } = require('./provider');
const FormatConverter = require('./format-converter');

/**
 * Parse a prompt from either .prompt or .yml format.
 * Auto-detects format based on content or filename.
 * @param {string} content - The prompt content
 * @param {string} [filename] - Optional filename for format detection
 * @returns {Object} Parsed AST
 */
function parsePrompt(content, filename = '') {
    const converter = new FormatConverter();
    return converter.parseAny(content, filename);
}

/**
 * Execute a prompt against an LLM provider.
 * @param {string|Object} promptContent - Prompt string or pre-parsed AST
 * @param {Object} [params] - Parameters to pass to the prompt
 * @param {Object} [options] - Execution options
 * @param {string} [options.provider='openai'] - Provider name: 'openai', 'groq', 'claude'
 * @param {string} [options.apiKey] - API key (defaults to PROMPTEL_API_KEY env var)
 * @param {string} [options.filename] - Filename for format detection
 * @returns {Promise<Object|string>} Execution result
 */
async function executePrompt(promptContent, params = {}, options = {}) {
    const ast = typeof promptContent === 'string'
        ? parsePrompt(promptContent, options.filename)
        : promptContent;

    const provider = options.provider || 'openai';
    const apiKey = options.apiKey || process.env.PROMPTEL_API_KEY;

    const executor = new PromptelExecutor(provider, apiKey);
    return await executor.execute(ast, params);
}

module.exports = {
    // Core classes
    PromptelParser,
    PromptelYamlParser,
    PromptelExecutor,
    FormatConverter,

    // Provider classes
    createProvider,
    ProviderInterface,
    OpenAIProvider,
    GroqProvider,
    ClaudeProvider,

    // Convenience functions
    parsePrompt,
    executePrompt,
};
