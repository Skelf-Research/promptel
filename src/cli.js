#!/usr/bin/env node
// cli.js
const fs = require('fs');
const { program } = require('commander');
const PromptelParser = require('./parser');
const PromptelExecutor = require('./executor');

program
    .version('1.0.0')
    .description('Promptel CLI - Execute Promptel prompts')
    .requiredOption('-f, --file <path>', 'Path to the Promptel file (.prompt)')
    .requiredOption('-p, --provider <type>', 'Provider type (openai, groq, or claude)')
    .requiredOption('-k, --api-key <key>', 'API key for the selected provider')
    .option('-o, --output <path>', 'Output file path (if not specified, prints to console)')
    .option('--params <json>', 'JSON string of parameters to pass to the prompt', '{}');

program.parse(process.argv);

const options = program.opts();

async function main() {
    try {
    // Read the Promptel file
        const promptelCode = fs.readFileSync(options.file, 'utf-8');

        // Parse the Promptel code
        const parser = new PromptelParser();
        const ast = parser.parse(promptelCode);

        // Create an executor
        const executor = new PromptelExecutor(options.provider, options.apiKey);

        // Parse the params JSON
        const params = JSON.parse(options.params);

        // Execute the prompt
        const result = await executor.execute(ast, params);

        // Output the result
        if (options.output) {
            fs.writeFileSync(options.output, result);
            console.log(`Result written to ${options.output}`);
        } else {
            console.log('Result:');
            console.log(result);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
