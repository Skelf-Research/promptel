// Test Harmony integration
const PromptelParser = require('../../src/parser');
const PromptelExecutor = require('../../src/executor');
const fs = require('fs');

async function testHarmonyIntegration() {
    console.log('🧪 Testing Promptel Harmony Integration\n');

    try {
        // 1. Read and parse Harmony example
        console.log('📖 Reading Harmony math solver example...');
        const path = require('path');
        const harmonyCode = fs.readFileSync(path.join(__dirname, '../simple_harmony.prompt'), 'utf-8');

        const parser = new PromptelParser();
        console.log('🔍 Parsing Harmony-enabled prompt...');
        const ast = parser.parse(harmonyCode);

        console.log('✅ Parse successful!');
        console.log('Sections found:', ast.prompts[0].sections.map(s => s.type));
        console.log('Full AST:', JSON.stringify(ast, null, 2));

        // 2. Check for harmony section
        const harmonySection = ast.prompts[0].sections.find(s => s.type === 'harmony');
        if (harmonySection) {
            console.log('🎯 Harmony section detected:', harmonySection);
        } else {
            console.log('❌ No harmony section found');
        }

        // 3. Test execution (without actual LLM call)
        console.log('\n🚀 Testing executor with Harmony context...');

        // Set a fake API key for testing
        process.env.PROMPTEL_API_KEY = 'fake-test-key';

        // Create a mock executor that doesn't call real LLM
        const mockExecutor = new PromptelExecutor('openai', 'fake-key');

        // Override the callLLM method to return a mock Harmony response
        mockExecutor.callLLM = async function(prompt, constraints) {
            console.log('📤 Mock LLM called with Harmony prompt:');
            console.log('Prompt type:', typeof prompt);
            console.log('Prompt:', prompt);
            if (typeof prompt === 'string') {
                console.log('Prompt length:', prompt.length);
                console.log('Contains harmony tokens:', prompt.includes('<|start|>'));
                console.log('First 200 chars:', prompt.substring(0, 200) + '...');
            }

            // Return a mock Harmony-formatted response
            return `<|start|>assistant<|channel|>final<|message|>25% of 80 is 20.

**Solution Steps:**
1. Convert percentage: 25% = 0.25
2. Multiply: 80 × 0.25 = 20
3. Verification: 80 ÷ 4 = 20 ✓<|end|>`;
        };

        const result = await mockExecutor.execute(ast, {
            question: "What is 25% of 80?"
        });

        console.log('\n📋 Execution Result:');
        console.log('Type:', typeof result);
        console.log('Success:', result.success !== false);

        if (result.channels) {
            console.log('\n🔄 Multi-Channel Output:');
            for (const [channel, content] of Object.entries(result.channels)) {
                console.log(`\n${channel.toUpperCase()}:`);
                console.log(content.trim());
            }
        } else {
            console.log('Standard output:', result);
        }

        console.log('\n✅ Harmony integration test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    }
}

testHarmonyIntegration();