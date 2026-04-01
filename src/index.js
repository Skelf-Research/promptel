// index.js
const PromptelParser = require('./parser');
const PromptelYamlParser = require('./yaml-parser');
const PromptelExecutor = require('./executor');
const { createProvider } = require('./provider');
const FormatConverter = require('./format-converter');

// Convenience function to parse either format
function parsePrompt(content, filename = '') {
    const converter = new FormatConverter();
    return converter.parseAny(content, filename);
}

// Convenience function to execute prompts from either format
async function executePrompt(promptContent, params = {}, options = {}) {
    const ast = parsePrompt(promptContent, options.filename);
    const provider = options.provider || 'openai';
    const apiKey = options.apiKey || process.env.PROMPTEL_API_KEY;

    const executor = new PromptelExecutor(provider, apiKey);
    return await executor.execute(ast, params);
}

module.exports = {
    PromptelParser,
    PromptelYamlParser,
    PromptelExecutor,
    FormatConverter,
    createProvider,
    parsePrompt,
    executePrompt
};
