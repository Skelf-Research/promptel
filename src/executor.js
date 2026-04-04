/**
 * Prompt execution engine with Harmony Protocol support.
 * Handles AST execution, technique processing, and LLM interaction.
 * @module executor
 */

const { createProvider } = require('./provider');
const {
    HarmonyRenderer,
    Conversation,
    Message,
    Role,
    ReasoningEffort,
    Channel,
    DEFAULT_HARMONY_ENCODING,
    createSystemContent
} = require('harmony-protocol-js');

class PromptelExecutor {
    constructor(providerType, apiKey) {
        this.provider = createProvider(providerType, apiKey);
        this.harmonyEncoding = DEFAULT_HARMONY_ENCODING;
        this.harmonyRenderer = new HarmonyRenderer();
    }

    async execute(ast, params = {}) {
        const context = {
            params,
            output: {},
            constraints: {},
            hooks: {},
            techniques: [],
            harmony: {
                enabled: false,
                reasoning: ReasoningEffort.MEDIUM,
                channels: [Channel.FINAL],
                conversation: new Conversation()
            }
        };

        for (const prompt of ast.prompts) {
            await this.executePrompt(prompt, context);
        }

        return this.formatOutput(context);
    }

    async executePrompt(prompt, context) {
        for (const section of prompt.sections) {
            await this.executeSection(section, context);
        }
    }

    async executeSection(section, context) {
        switch (section.type) {
            case 'meta':
                this.executeMeta(section, context);
                break;
            case 'params':
                this.executeParams(section, context);
                break;
            case 'body':
                await this.executeBody(section, context);
                break;
            case 'technique':
                await this.executeTechnique(section, context);
                break;
            case 'constraints':
                this.executeConstraints(section, context);
                break;
            case 'output':
                this.executeOutput(section, context);
                break;
            case 'hooks':
                this.executeHooks(section, context);
                break;
            case 'harmony':
                this.executeHarmony(section, context);
                break;
            default:
                throw new Error(`Unknown section type: ${section.type}`);
        }
    }

    executeMeta(section, context) {
        context.meta = {};
        if (section.fields && Array.isArray(section.fields)) {
            context.meta = section.fields.reduce((acc, field) => {
                acc[field.name] = this.evaluateExpression(field.value, context);
                return acc;
            }, {});
        }
    }

    executeParams(section, context) {
        // Handle incomplete AST where fields might not be present
        if (!section.fields || !Array.isArray(section.fields)) {
            return;
        }

        for (const param of section.fields) {
            // Handle default values
            if (!(param.name in context.params) && Object.prototype.hasOwnProperty.call(param, 'defaultValue')) {
                context.params[param.name] = param.defaultValue;
            }

            // Check if required parameter is missing
            if (!(param.name in context.params) && !param.isOptional) {
                throw new Error(`Missing required parameter: ${param.name}`);
            }

            // Type checking could be added here
        }
    }

    async executeBody(section, context) {
        let bodyContent = '';
        for (const content of section.content) {
            if (content.type === 'TextBlock') {
                // Extract the text from the backticks
                const text = content.content.substring(1, content.content.length - 1);
                bodyContent += this.interpolate(text, context);
            }
            // Handle other content types as needed
        }
        context.bodyContent = bodyContent;
    }

    async executeTechnique(section, context) {
        for (const technique of section.techniques) {
            const handler = this.getTechniqueHandler(technique.type);
            await handler(technique, context);
            context.techniques.push(technique);
        }
    }

    executeConstraints(section, context) {
        for (const constraint of section.fields) {
            context.constraints[constraint.name] = this.evaluateExpression(constraint.value, context);
        }
    }

    executeOutput(section, context) {
        for (const field of section.fields) {
            context.output[field.name] = this.evaluateExpression(field.value, context);
        }
    }

    executeHooks(section, context) {
        for (const hook of section.hooks) {
            context.hooks[hook.name] = this.createHookFunction(hook, context);
        }
    }

    executeHarmony(section, context) {
        // Enable harmony mode
        context.harmony.enabled = true;

        // Process harmony configuration fields
        if (section.fields) {
            for (const field of section.fields) {
                const value = this.evaluateExpression(field.value, context);

                switch (field.name) {
                    case 'reasoning':
                        context.harmony.reasoning = value;
                        break;
                    case 'channels':
                        if (Array.isArray(value)) {
                            context.harmony.channels = value;
                        } else if (typeof value === 'string') {
                            context.harmony.channels = [value];
                        }
                        break;
                    case 'encoding':
                        context.harmony.encoding = value;
                        break;
                }
            }
        }
    }

    getTechniqueHandler(techniqueType) {
        const handlers = {
            'chainOfThought': this.executeChainOfThought.bind(this),
            'fewShot': this.executeFewShot.bind(this),
            'zeroShot': this.executeZeroShot.bind(this),
            'selfConsistency': this.executeSelfConsistency.bind(this),
            'treeOfThoughts': this.executeTreeOfThoughts.bind(this),
            'reWOO': this.executeReWOO.bind(this),
            'reAct': this.executeReAct.bind(this),
            // Add other technique handlers here
        };

        const handler = handlers[techniqueType];
        if (!handler) {
            throw new Error(`Unknown technique type: ${techniqueType}`);
        }
        return handler;
    }

    async executeChainOfThought(technique, context) {
        context.chainOfThought = [];
        for (const step of technique.steps) {
            const stepContent = await this.executeBlock(step.block, context);
            context.chainOfThought.push(`Step: ${step.name}\n${stepContent}`);
        }
    }

    async executeFewShot(technique, context) {
        context.examples = technique.examples.map(example => ({
            input: this.interpolate(example.input, context),
            output: this.interpolate(example.output, context),
        }));
    }

    async executeZeroShot(technique, context) {
        context.instruction = this.interpolate(technique.instruction, context);
    }

    async executeSelfConsistency(_technique, _context) {
        // Implementation for Self-Consistency technique
    }

    async executeTreeOfThoughts(_technique, _context) {
        // Implementation for Tree of Thoughts technique
    }

    async executeReWOO(_technique, _context) {
        // Implementation for ReWOO technique
    }

    async executeReAct(_technique, _context) {
        // Implementation for ReAct technique
    }

    async executeBlock(block, context) {
        // Execute a block of content (used in techniques)
        let content = '';
        for (const item of block) {
            if (item.type === 'text') {
                content += this.interpolate(item.value, context);
            }
            // Handle other block content types as needed
        }
        return content;
    }

    interpolate(text, context) {
        return text.replace(/\$\{([^}]+)\}/g, (match, expr) => {
            return this.evaluateExpression(expr, context);
        });
    }

    evaluateExpression(expr, context) {
        // Simple expression evaluation
        // This should be expanded for more complex expressions
        if (expr.startsWith('params.')) {
            const key = expr.split('.')[1];
            return context.params[key];
        }
        return expr; // Return as-is for now
    }

    createHookFunction(_hook, _context) {
        // Create a function from the hook definition
        return (input) => {
            // Execute the hook logic here
            return input; // Placeholder implementation
        };
    }

    async formatOutput(context) {
        // If Harmony mode is enabled, use Harmony workflow
        if (context.harmony.enabled) {
            return await this.formatHarmonyOutput(context);
        }

        // Original non-Harmony output formatting
        let result = '';

        if (context.meta) {
            result += `Meta:\n${JSON.stringify(context.meta, null, 2)}\n\n`;
        }

        if (context.chainOfThought) {
            result += `Chain of Thought:\n${context.chainOfThought.join('\n')}\n\n`;
        }

        if (context.examples) {
            result += `Examples:\n${JSON.stringify(context.examples, null, 2)}\n\n`;
        }

        if (context.instruction) {
            result += `Instruction:\n${context.instruction}\n\n`;
        }

        result += `Task:\n${context.bodyContent}\n\n`;

        if (Object.keys(context.output).length > 0) {
            result += `Output:\n${JSON.stringify(context.output, null, 2)}\n`;
        }

        // Apply post-processing hook if it exists
        if (context.hooks.postProcess) {
            result = context.hooks.postProcess(result);
        }

        return result;
    }

    async formatHarmonyOutput(context) {
        // Build Harmony conversation using the new API
        const conversation = new Conversation();

        // Create system content with Harmony features
        let systemContent = createSystemContent();

        if (context.meta) {
            if (context.meta.name) {
                systemContent = systemContent.withKnowledgeCutoff('2024-06')
                    .withReasoningEffort(context.harmony.reasoning);
            }
        }

        // Add required channels if specified
        if (context.harmony.channels && context.harmony.channels.length > 0) {
            systemContent = systemContent.withRequiredChannels(context.harmony.channels);
        }

        // Add system message
        conversation.addMessage(Message.system(systemContent));

        // Add developer instructions if we have body content or techniques
        if (context.bodyContent || context.techniques.length > 0) {
            let devContent = 'Follow the user instructions carefully.';

            if (context.techniques.length > 0) {
                devContent += ' Use structured reasoning and show your work in the analysis channel.';
            }

            conversation.addMessage(Message.developer(devContent));
        }

        // Add user message with the actual task
        if (context.bodyContent) {
            conversation.addMessage(Message.user(context.bodyContent));
        }

        // Render conversation as text for LLM provider
        const conversationText = this.harmonyEncoding.renderConversation(conversation);

        // Send to LLM
        const llmResponse = await this.callLLM(conversationText, context.constraints);

        // Parse the Harmony response from text
        const messages = this.harmonyEncoding.parseMessagesFromText(llmResponse);

        // Extract channels from the assistant message
        const assistantMessages = messages.filter(m => m.role === Role.ASSISTANT);
        let result = {
            success: true,
            channels: {},
            metadata: {
                reasoning: context.harmony.reasoning,
                totalMessages: messages.length,
                assistantMessages: assistantMessages.length
            }
        };

        // Process all assistant messages and organize by channel
        for (const message of assistantMessages) {
            const channel = message.channel || 'final';
            if (!result.channels[channel]) {
                result.channels[channel] = '';
            }
            result.channels[channel] += message.content;
        }

        // Ensure there's at least a final channel
        if (Object.keys(result.channels).length === 0 && assistantMessages.length > 0) {
            result.channels.final = assistantMessages[0].content;
        }

        // Apply post-processing hook if it exists
        if (context.hooks.postProcess) {
            result = context.hooks.postProcess(result);
        }

        return result;
    }

    async callLLM(prompt, constraints) {
        return this.provider.generateResponse(prompt, constraints);
    }
}

module.exports = PromptelExecutor;
