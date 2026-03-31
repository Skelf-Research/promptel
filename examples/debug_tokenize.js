const { createToken, Lexer } = require("chevrotain");

// Simple test to tokenize the problematic section
const code = `prompt TestPrompt {
  technique {
    fewShot {
      example {
        input: text\`Question\`
        output: text\`Answer\`
      }
    }
  }
}`;

console.log("Tokenizing...");
const NudgeLexer = require('./src/parser.js'); // This exports the lexer

// Actually, let me create a simpler test
const tokens = [
  { name: "Identifier", pattern: /[a-zA-Z]\\w*/ },
  { name: "Text", pattern: /text/ },
  { name: "BacktickString", pattern: /`[^`]*`/ },
  { name: "Colon", pattern: /:/ },
  { name: "LCurly", pattern: /{/ },
  { name: "RCurly", pattern: /}/ },
  { name: "WhiteSpace", pattern: /\\s+/, group: Lexer.SKIPPED }
];

console.log("Code to tokenize:");
console.log(code);

// Let's manually check what tokens should be produced for the problematic section
const section = "input: text`Question`\
        output: text`Answer`";
console.log("\nSection to analyze:");
console.log(section);

console.log("\nExpected token sequence:");
console.log("1. Identifier: input");
console.log("2. Colon: :");
console.log("3. Text: text");
console.log("4. BacktickString: `Question`");
console.log("5. Identifier: output"); 
console.log("6. Colon: :");
console.log("7. Text: text");
console.log("8. BacktickString: `Answer`");
console.log("9. RCurly: }");