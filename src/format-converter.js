// format-converter.js
const yaml = require('js-yaml');
const PromptelParser = require('./parser');
const PromptelYamlParser = require('./yaml-parser');

class FormatConverter {
    constructor() {
        this.promptParser = new PromptelParser();
        this.yamlParser = new PromptelYamlParser();
    }

    // Detect format based on content or file extension
    detectFormat(content, filename = '') {
        if (filename.endsWith('.yml') || filename.endsWith('.yaml')) {
            return 'yaml';
        }
        if (filename.endsWith('.prompt')) {
            return 'prompt';
        }

        // Content-based detection
        const trimmed = content.trim();

        // YAML typically starts with name: or has YAML structure
        if (trimmed.startsWith('name:') || this.looksLikeYaml(content)) {
            return 'yaml';
        }

        // Prompt format starts with 'prompt'
        if (trimmed.startsWith('prompt ')) {
            return 'prompt';
        }

        throw new Error('Unable to detect format. Please specify file extension (.prompt or .yml)');
    }

    looksLikeYaml(content) {
        try {
            yaml.load(content);
            return true;
        } catch {
            return false;
        }
    }

    // Parse content in either format to AST
    parseAny(content, filename = '') {
        const format = this.detectFormat(content, filename);

        if (format === 'yaml') {
            return this.yamlParser.parse(content);
        } else {
            return this.promptParser.parse(content);
        }
    }

    // Convert from AST to YAML format
    astToYaml(ast) {
        if (!ast.prompts || ast.prompts.length === 0) {
            throw new Error('No prompts found in AST');
        }

        const prompt = ast.prompts[0]; // Convert first prompt
        const yamlData = {
            name: prompt.name
        };

        // Convert each section
        prompt.sections.forEach(section => {
            switch (section.type) {
                case 'meta':
                    yamlData.meta = this.convertMetaToYaml(section);
                    break;
                case 'harmony':
                    yamlData.harmony = this.convertHarmonyToYaml(section);
                    break;
                case 'context':
                    yamlData.context = this.convertContextToYaml(section);
                    break;
                case 'params':
                    yamlData.params = this.convertParamsToYaml(section);
                    break;
                case 'body':
                    yamlData.body = this.convertBodyToYaml(section);
                    break;
                case 'constraints':
                    yamlData.constraints = this.convertConstraintsToYaml(section);
                    break;
                case 'output':
                    yamlData.output = this.convertOutputToYaml(section);
                    break;
                case 'hooks':
                    yamlData.hooks = this.convertHooksToYaml(section);
                    break;
            }
        });

        return yaml.dump(yamlData, {
            indent: 2,
            lineWidth: 100,
            noRefs: true
        });
    }

    // Convert from AST to .prompt format
    astToPrompt(ast) {
        if (!ast.prompts || ast.prompts.length === 0) {
            throw new Error('No prompts found in AST');
        }

        const prompt = ast.prompts[0];
        let promptText = `prompt ${prompt.name} {\n`;

        prompt.sections.forEach(section => {
            promptText += this.sectionToPrompt(section, 1);
        });

        promptText += '}';
        return promptText;
    }

    sectionToPrompt(section, indent = 0) {
        const indentStr = '  '.repeat(indent);
        let result = '';

        switch (section.type) {
            case 'meta':
                result += `${indentStr}meta {\n`;
                if (section.fields) {
                    section.fields.forEach(field => {
                        const value = typeof field.value === 'string' ? `"${field.value}"` : field.value;
                        result += `${indentStr}  ${field.name}: ${value};\n`;
                    });
                }
                result += `${indentStr}}\n\n`;
                break;

            case 'harmony':
                result += `${indentStr}harmony {\n`;
                if (section.fields) {
                    section.fields.forEach(field => {
                        const value = Array.isArray(field.value)
                            ? `[${field.value.map(v => `"${v}"`).join(', ')}]`
                            : `"${field.value}"`;
                        result += `${indentStr}  ${field.name}: ${value};\n`;
                    });
                }
                result += `${indentStr}}\n\n`;
                break;

            case 'params':
                result += `${indentStr}params {\n`;
                if (section.fields) {
                    section.fields.forEach(field => {
                        let paramLine = `${indentStr}  ${field.name}`;
                        if (field.isOptional) paramLine += '?';
                        paramLine += `: ${field.paramType}`;
                        if (field.defaultValue !== undefined) {
                            const defaultVal = typeof field.defaultValue === 'string'
                                ? `"${field.defaultValue}"`
                                : field.defaultValue;
                            paramLine += ` = ${defaultVal}`;
                        }
                        paramLine += ';\n';
                        result += paramLine;
                    });
                }
                result += `${indentStr}}\n\n`;
                break;

            case 'body':
                result += `${indentStr}body {\n`;
                if (section.content) {
                    section.content.forEach(item => {
                        if (item.type === 'TextBlock') {
                            // Remove backticks if they exist and add them properly
                            let text = item.content;
                            if (text.startsWith('`') && text.endsWith('`')) {
                                text = text.slice(1, -1);
                            }
                            result += `${indentStr}  text\`${text}\`;\n`;
                        }
                    });
                }
                result += `${indentStr}}\n\n`;
                break;

            // Add other sections as needed...
            default:
                result += `${indentStr}// ${section.type} section conversion not implemented\n\n`;
        }

        return result;
    }

    // Helper methods for converting sections to YAML
    convertMetaToYaml(section) {
        const meta = {};
        if (section.fields && Array.isArray(section.fields)) {
            section.fields.forEach(field => {
                if (field && field.name !== undefined) {
                    meta[field.name] = field.value;
                }
            });
        }
        return meta;
    }

    convertHarmonyToYaml(section) {
        const harmony = {};
        if (section.fields) {
            section.fields.forEach(field => {
                harmony[field.name] = field.value;
            });
        }
        return harmony;
    }

    convertContextToYaml(section) {
        const context = {};
        if (section.fields) {
            section.fields.forEach(field => {
                context[field.name] = field.value;
            });
        }
        return context;
    }

    convertParamsToYaml(section) {
        const params = {};
        if (section.fields) {
            section.fields.forEach(field => {
                params[field.name] = {
                    type: field.paramType || 'string',
                    required: !field.isOptional
                };
                if (field.defaultValue !== undefined) {
                    params[field.name].default = field.defaultValue;
                }
            });
        }
        return params;
    }

    convertBodyToYaml(section) {
        const body = {};
        if (section.content) {
            section.content.forEach(item => {
                if (item.type === 'TextBlock') {
                    // Remove backticks if they exist
                    let text = item.content;
                    if (text.startsWith('`') && text.endsWith('`')) {
                        text = text.slice(1, -1);
                    }
                    body.text = text;
                }
            });
        }
        return body;
    }

    convertConstraintsToYaml(section) {
        const constraints = {};
        if (section.fields) {
            section.fields.forEach(field => {
                constraints[field.name] = field.value;
            });
        }
        return constraints;
    }

    convertOutputToYaml(section) {
        const output = {};
        if (section.fields) {
            section.fields.forEach(field => {
                output[field.name] = field.value;
            });
        }
        return output;
    }

    convertHooksToYaml(section) {
        const hooks = {};
        if (section.hooks) {
            section.hooks.forEach(hook => {
                hooks[hook.name] = hook.code;
            });
        }
        return hooks;
    }

    // Public conversion methods
    promptToYaml(promptContent) {
        const ast = this.promptParser.parse(promptContent);
        return this.astToYaml(ast);
    }

    yamlToPrompt(yamlContent) {
        const ast = this.yamlParser.parse(yamlContent);
        return this.astToPrompt(ast);
    }

    // Convert between any formats
    convert(content, fromFormat, toFormat, filename = '') {
        if (!fromFormat) {
            fromFormat = this.detectFormat(content, filename);
        }

        let ast;
        if (fromFormat === 'yaml') {
            ast = this.yamlParser.parse(content);
        } else if (fromFormat === 'prompt') {
            ast = this.promptParser.parse(content);
        } else {
            throw new Error(`Unsupported source format: ${fromFormat}`);
        }

        if (toFormat === 'yaml') {
            return this.astToYaml(ast);
        } else if (toFormat === 'prompt') {
            return this.astToPrompt(ast);
        } else {
            throw new Error(`Unsupported target format: ${toFormat}`);
        }
    }
}

module.exports = FormatConverter;
