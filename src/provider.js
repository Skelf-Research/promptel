/**
 * Provider abstraction layer for multiple LLM backends.
 * Supports OpenAI, Anthropic (Claude), and Groq providers.
 * @module provider
 */

require('openai/shims/node');
require('groq-sdk/shims/node');
require('@anthropic-ai/sdk/shims/node');

const OpenAI = require('openai');
const Groq = require('groq-sdk');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * Base interface for all LLM providers.
 * Extend this class to implement custom providers.
 */
class ProviderInterface {
    /**
     * @param {string} [apiKey] - API key for the provider
     */
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.PROMPTEL_API_KEY;
        if (!this.apiKey) {
            throw new Error('API key required. Pass it directly or set PROMPTEL_API_KEY environment variable.');
        }
    }

    /**
     * Generate a response from the LLM.
     * @param {string} _prompt - The prompt to send
     * @param {Object} _constraints - Generation constraints (temperature, maxTokens, etc.)
     * @returns {Promise<string>} The generated response
     */
    async generateResponse(_prompt, _constraints) {
        throw new Error('Method not implemented');
    }
}

/**
 * OpenAI provider implementation.
 * Supports GPT-4, GPT-3.5-turbo, and other OpenAI models.
 */
class OpenAIProvider extends ProviderInterface {
    constructor(apiKey) {
        super(apiKey);
        this.client = new OpenAI({ apiKey: this.apiKey });
    }

    async generateResponse(prompt, constraints = {}) {
        const { maxTokens, temperature, topP, frequencyPenalty, presencePenalty, model } = constraints;

        const response = await this.client.chat.completions.create({
            model: model || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature,
            top_p: topP,
            frequency_penalty: frequencyPenalty,
            presence_penalty: presencePenalty,
        });

        return response.choices[0].message.content;
    }
}

/**
 * Groq provider implementation.
 * Supports Mixtral, LLaMA, and other Groq-hosted models.
 */
class GroqProvider extends ProviderInterface {
    constructor(apiKey) {
        super(apiKey);
        this.client = new Groq({ apiKey: this.apiKey });
    }

    async generateResponse(prompt, constraints = {}) {
        const { maxTokens, temperature, topP, model } = constraints;

        const response = await this.client.chat.completions.create({
            model: model || 'mixtral-8x7b-32768',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature,
            top_p: topP,
        });

        return response.choices[0].message.content;
    }
}

/**
 * Anthropic Claude provider implementation.
 * Supports Claude 3, Claude 3.5, and other Anthropic models.
 */
class ClaudeProvider extends ProviderInterface {
    constructor(apiKey) {
        super(apiKey);
        this.client = new Anthropic({ apiKey: this.apiKey });
    }

    async generateResponse(prompt, constraints = {}) {
        const { maxTokens, temperature, topP, model } = constraints;

        const response = await this.client.messages.create({
            model: model || 'claude-3-5-sonnet-20241022',
            max_tokens: maxTokens || 4096,
            messages: [{ role: 'user', content: prompt }],
            temperature,
            top_p: topP,
        });

        return response.content[0].text;
    }
}

/**
 * Factory function to create a provider instance.
 * @param {string} [type] - Provider type: 'openai', 'groq', 'claude', or 'anthropic'
 * @param {string} [apiKey] - API key for the provider
 * @returns {ProviderInterface} Provider instance
 */
function createProvider(type, apiKey) {
    const providerType = type || process.env.PROMPTEL_PROVIDER || 'openai';

    switch (providerType.toLowerCase()) {
        case 'openai':
            return new OpenAIProvider(apiKey);
        case 'groq':
            return new GroqProvider(apiKey);
        case 'claude':
        case 'anthropic':
            return new ClaudeProvider(apiKey);
        default:
            throw new Error(`Unsupported provider: ${providerType}. Use 'openai', 'groq', or 'claude'.`);
    }
}

module.exports = {
    ProviderInterface,
    OpenAIProvider,
    GroqProvider,
    ClaudeProvider,
    createProvider,
};
