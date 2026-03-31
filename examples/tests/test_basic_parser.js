// Test basic parser functionality
const PromptelParser = require('./src/parser');

console.log('🧪 Testing Basic Parser\n');

const parser = new PromptelParser();

// Test 1: Basic prompt
console.log('Test 1: Basic prompt');
try {
    const code = `prompt TestPrompt {
  body {
    text\`Hello world\`
  }
}`;
    const ast = parser.parse(code);
    console.log('✅ Basic prompt parsed successfully');
    console.log('Sections:', ast.prompts[0].sections.map(s => s.type));
} catch (error) {
    console.log('❌ Basic prompt failed:', error.message);
}

// Test 2: Harmony section
console.log('\nTest 2: Harmony section');
try {
    const code = `prompt TestHarmony {
  harmony {
    reasoning: "high"
  }
  body {
    text\`Hello world\`
  }
}`;
    const ast = parser.parse(code);
    console.log('✅ Harmony section parsed successfully');
    console.log('Sections:', ast.prompts[0].sections.map(s => s.type));
    const harmonySection = ast.prompts[0].sections.find(s => s.type === 'harmony');
    console.log('Harmony fields:', harmonySection ? harmonySection.fields : 'none');
} catch (error) {
    console.log('❌ Harmony section failed:', error.message);
}