#!/usr/bin/env node
// cli.js
const fs = require('fs');
const { program } = require('commander');
const { parsePrompt, executePrompt } = require('./index');
const FormatConverter = require('./format-converter');

program
    .version('1.0.0')
    .description('Promptel CLI - Execute Promptel prompts in .prompt or .yml format')
    .requiredOption('-f, --file <path>', 'Path to the Promptel file (.prompt or .yml)')
    .option('-p, --provider <type>', 'Provider type (openai, groq, or claude) [required for execution]')
    .option('-k, --api-key <key>', 'API key for the selected provider [required for execution]')
    .option('-o, --output <path>', 'Output file path (if not specified, prints to console)')
    .option('--params <json>', 'JSON string of parameters to pass to the prompt', '{}')
    .option('--convert <format>', 'Convert file to specified format (prompt|yaml) and exit')
    .option('--format <format>', 'Force input format detection (prompt|yaml)');

program.parse(process.argv);

const options = program.opts();

async function main() {
    try {
        // Read the file
        const fileContent = fs.readFileSync(options.file, 'utf-8');

        // Handle conversion mode
        if (options.convert) {
            const converter = new FormatConverter();
            const inputFormat = options.format || converter.detectFormat(fileContent, options.file);
            const targetFormat = options.convert.toLowerCase();

            if (targetFormat !== 'prompt' && targetFormat !== 'yaml') {
                throw new Error('Convert format must be either "prompt" or "yaml"');
            }

            const converted = converter.convert(fileContent, inputFormat, targetFormat);

            if (options.output) {
                fs.writeFileSync(options.output, converted);
                console.log(`Converted from ${inputFormat} to ${targetFormat} and saved to ${options.output}`);
            } else {
                console.log(`Converted from ${inputFormat} to ${targetFormat}:`);
                console.log(converted);
            }
            return;
        }

        // Ensure provider and API key are provided for execution
        if (!options.provider || !options.apiKey) {
            throw new Error('Provider (-p) and API key (-k) are required for prompt execution');
        }

        // Parse the params JSON
        const params = JSON.parse(options.params);

        // Execute the prompt using the universal function
        const result = await executePrompt(fileContent, params, {
            filename: options.file,
            provider: options.provider,
            apiKey: options.apiKey
        });

        // Output the result
        if (options.output) {
            const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
            fs.writeFileSync(options.output, output);
            console.log(`Result written to ${options.output}`);
        } else {
            console.log('Result:');
            if (typeof result === 'object') {
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log(result);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
