// Debug AST generation
const PromptelParser = require('../../src/parser');
const fs = require('fs');
const path = require('path');

const parser = new PromptelParser();

try {
    const promptContent = fs.readFileSync(path.join(__dirname, '../simple_harmony.prompt'), 'utf-8');
    console.log('Parsing prompt:');
    console.log(promptContent);

    const ast = parser.parse(promptContent);
    console.log('\nGenerated AST:');
    console.log(JSON.stringify(ast, null, 2));

    // Look specifically at sections
    if (ast.prompts && ast.prompts.length > 0) {
        const prompt = ast.prompts[0];
        console.log('\nPrompt sections:');
        prompt.sections.forEach((section, index) => {
            console.log(`Section ${index}: ${section.type}`);
            console.log(JSON.stringify(section, null, 2));
        });
    }

} catch (error) {
    console.error('Error parsing:', error.message);
    console.error(error.stack);
}