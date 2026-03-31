// yaml-parser.js
const yaml = require('js-yaml');

class PromptelYamlParser {
    constructor() {
        this.format = 'yaml';
    }

    parse(yamlContent) {
        try {
            const data = yaml.load(yamlContent);
            return this.convertToAST(data);
        } catch (error) {
            throw new Error(`YAML parsing error: ${error.message}`);
        }
    }

    convertToAST(yamlData) {
        const ast = {
            type: 'Program',
            prompts: []
        };

        const prompt = {
            type: 'Prompt',
            name: yamlData.name,
            sections: []
        };

        // Convert each section
        if (yamlData.meta) {
            prompt.sections.push(this.convertMetaSection(yamlData.meta));
        }

        if (yamlData.harmony) {
            prompt.sections.push(this.convertHarmonySection(yamlData.harmony));
        }

        if (yamlData.context) {
            prompt.sections.push(this.convertContextSection(yamlData.context));
        }

        if (yamlData.params) {
            prompt.sections.push(this.convertParamsSection(yamlData.params));
        }

        if (yamlData.body) {
            prompt.sections.push(this.convertBodySection(yamlData.body));
        }

        if (yamlData.constraints) {
            prompt.sections.push(this.convertConstraintsSection(yamlData.constraints));
        }

        if (yamlData.output) {
            prompt.sections.push(this.convertOutputSection(yamlData.output));
        }

        if (yamlData.hooks) {
            prompt.sections.push(this.convertHooksSection(yamlData.hooks));
        }

        ast.prompts.push(prompt);
        return ast;
    }

    convertMetaSection(meta) {
        return {
            type: 'meta',
            fields: Object.entries(meta).map(([key, value]) => ({
                name: key,
                value: value
            }))
        };
    }

    convertHarmonySection(harmony) {
        const fields = [];

        if (harmony.reasoning) {
            fields.push({ name: 'reasoning', value: harmony.reasoning });
        }

        if (harmony.channels) {
            fields.push({ name: 'channels', value: harmony.channels });
        }

        if (harmony.encoding) {
            fields.push({ name: 'encoding', value: harmony.encoding });
        }

        return {
            type: 'harmony',
            fields: fields
        };
    }

    convertContextSection(context) {
        return {
            type: 'context',
            fields: Object.entries(context).map(([key, value]) => ({
                name: key,
                value: value
            }))
        };
    }

    convertParamsSection(params) {
        const fields = Object.entries(params).map(([name, config]) => {
            const field = {
                type: 'ParamField',
                name: name,
                isOptional: !config.required,
                paramType: config.type
            };

            if (config.default !== undefined) {
                field.defaultValue = config.default;
            }

            return field;
        });

        return {
            type: 'params',
            fields: fields
        };
    }

    convertBodySection(body) {
        const content = [];

        if (body.text) {
            content.push({
                type: 'TextBlock',
                content: `\`${body.text}\``
            });
        }

        // Handle techniques
        if (body.technique) {
            const techniques = this.convertTechniques(body.technique);
            content.push(...techniques);
        }

        return {
            type: 'body',
            content: content
        };
    }

    convertTechniques(techniqueObj) {
        const techniques = [];

        Object.entries(techniqueObj).forEach(([techniqueType, config]) => {
            const technique = {
                type: 'technique',
                techniqueType: techniqueType,
                config: config
            };

            if (config.steps && Array.isArray(config.steps)) {
                technique.steps = config.steps.map(step => ({
                    name: step.name,
                    channel: step.channel,
                    block: [{
                        type: 'text',
                        value: step.text
                    }]
                }));
            }

            techniques.push(technique);
        });

        return techniques;
    }

    convertConstraintsSection(constraints) {
        return {
            type: 'constraints',
            fields: Object.entries(constraints).map(([key, value]) => ({
                name: key,
                value: value
            }))
        };
    }

    convertOutputSection(output) {
        return {
            type: 'output',
            fields: Object.entries(output).map(([key, value]) => ({
                name: key,
                value: value
            }))
        };
    }

    convertHooksSection(hooks) {
        return {
            type: 'hooks',
            hooks: Object.entries(hooks).map(([name, code]) => ({
                name: name,
                code: code
            }))
        };
    }
}

module.exports = PromptelYamlParser;