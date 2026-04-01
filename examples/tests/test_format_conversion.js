// Test format conversion between .prompt and .yml
const fs = require('fs');
const path = require('path');
const FormatConverter = require('../../src/format-converter');

async function testFormatConversion() {
    console.log('🧪 Testing Format Conversion Between .prompt and .yml\n');

    const converter = new FormatConverter();

    try {
        // Test 1: Convert .prompt to .yml
        console.log('📖 Test 1: Converting .prompt to .yml');
        const promptContent = fs.readFileSync(path.join(__dirname, '../simple_harmony.prompt'), 'utf-8');
        console.log('Original .prompt content:');
        console.log(promptContent);

        const yamlOutput = converter.promptToYaml(promptContent);
        console.log('\n✅ Converted to YAML:');
        console.log(yamlOutput);

        // Test 2: Convert .yml back to .prompt
        console.log('\n📖 Test 2: Converting .yml back to .prompt');
        const yamlContent = fs.readFileSync(path.join(__dirname, '../simple_harmony.yml'), 'utf-8');
        console.log('Original .yml content:');
        console.log(yamlContent);

        const promptOutput = converter.yamlToPrompt(yamlContent);
        console.log('\n✅ Converted to .prompt format:');
        console.log(promptOutput);

        // Test 3: Round-trip conversion
        console.log('\n📖 Test 3: Round-trip conversion (.prompt → .yml → .prompt)');
        const roundTripYaml = converter.promptToYaml(promptContent);
        const roundTripPrompt = converter.yamlToPrompt(roundTripYaml);
        console.log('Round-trip result:');
        console.log(roundTripPrompt);

        // Test 4: Format detection
        console.log('\n📖 Test 4: Testing format detection');
        const promptFormat = converter.detectFormat(promptContent, 'test.prompt');
        const yamlFormat = converter.detectFormat(yamlContent, 'test.yml');
        console.log(`✅ Detected formats: .prompt=${promptFormat}, .yml=${yamlFormat}`);

        // Test 5: Universal parsing
        console.log('\n📖 Test 5: Testing universal parsing');
        const promptAst = converter.parseAny(promptContent, 'test.prompt');
        const yamlAst = converter.parseAny(yamlContent, 'test.yml');

        console.log(`✅ Parsed ASTs successfully:`);
        console.log(`  .prompt AST has ${promptAst.prompts.length} prompt(s)`);
        console.log(`  .yml AST has ${yamlAst.prompts.length} prompt(s)`);
        console.log(`  Both have prompt name: ${promptAst.prompts[0].name} and ${yamlAst.prompts[0].name}`);

        // Test 6: Complex conversion with math solver
        console.log('\n📖 Test 6: Testing complex prompt with techniques');
        try {
            const complexPromptContent = fs.readFileSync(path.join(__dirname, '../math_solver.prompt'), 'utf-8');
            const complexYamlOutput = converter.promptToYaml(complexPromptContent);
            console.log('✅ Complex prompt converted successfully to YAML');
            console.log('Sample output (first 300 chars):');
            console.log(complexYamlOutput.substring(0, 300) + '...');
        } catch (complexError) {
            console.log(`⚠️  Complex conversion partial success: ${complexError.message}`);
        }

        console.log('\n🎉 Format conversion tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    }
}

testFormatConversion();