// parser.js
const { createToken, Lexer, CstParser } = require('chevrotain');

// Define tokens
const Prompt = createToken({ name: 'Prompt', pattern: /prompt/ });
const Meta = createToken({ name: 'Meta', pattern: /meta/ });
const Body = createToken({ name: 'Body', pattern: /body/ });
const Technique = createToken({ name: 'Technique', pattern: /technique/ });
const Constraints = createToken({ name: 'Constraints', pattern: /constraints/ });
const Output = createToken({ name: 'Output', pattern: /output/ });
const Hooks = createToken({ name: 'Hooks', pattern: /hooks/ });
const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z]\w*/ });
const LCurly = createToken({ name: 'LCurly', pattern: /{/ });
const RCurly = createToken({ name: 'RCurly', pattern: /}/ });
const Colon = createToken({ name: 'Colon', pattern: /:/ });
const Semicolon = createToken({ name: 'Semicolon', pattern: /;/ });
const Text = createToken({ name: 'Text', pattern: /text/ });
const BacktickString = createToken({ name: 'BacktickString', pattern: /`[^`]*`/ });
const StringLiteral = createToken({ name: 'StringLiteral', pattern: /"(?:[^"\\]|\\.)*"/ });
const NumberLiteral = createToken({ name: 'NumberLiteral', pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ });
const BooleanLiteral = createToken({ name: 'BooleanLiteral', pattern: /true|false/ });
const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: Lexer.SKIPPED
});

// Add these to your token definitions
const Equals = createToken({ name: 'Equals', pattern: /=/ });

const If = createToken({ name: 'If', pattern: /\bif\b/ });
const Else = createToken({ name: 'Else', pattern: /\belse\b/ });
const For = createToken({ name: 'For', pattern: /\bfor\b/ });
const Of = createToken({ name: 'Of', pattern: /\bof\b/ });
const Step = createToken({ name: 'Step', pattern: /\bstep\b/ });
const LParen = createToken({ name: 'LParen', pattern: /\(/ });
const RParen = createToken({ name: 'RParen', pattern: /\)/ });
const LBracket = createToken({ name: 'LBracket', pattern: /\[/ });
const RBracket = createToken({ name: 'RBracket', pattern: /\]/ });
const Comma = createToken({ name: 'Comma', pattern: /,/ });
const AnyToken = createToken({ name: 'AnyToken', pattern: /[^}]+/ });
const QuestionMark = createToken({ name: 'QuestionMark', pattern: /\?/ });
const Dot = createToken({ name: 'Dot', pattern: /\./ });

const Context = createToken({ name: 'Context', pattern: /context/ });

// Harmony-specific tokens
const Format = createToken({ name: 'Format', pattern: /format/ });
const Harmony = createToken({ name: 'Harmony', pattern: /harmony/ });
const Channels = createToken({ name: 'Channels', pattern: /channels/ });
const Reasoning = createToken({ name: 'Reasoning', pattern: /reasoning/ });
const Channel = createToken({ name: 'Channel', pattern: /channel/ });
const Encoding = createToken({ name: 'Encoding', pattern: /encoding/ });

const Arrow = createToken({ name: 'Arrow', pattern: /=>/ });
const Return = createToken({ name: 'Return', pattern: /\breturn\b/ });

const allTokens = [
    WhiteSpace,
    // Tokens that don't conflict with Arrow
    Prompt, Meta, Context, Body, Technique, Constraints, Output, Hooks,
    // Harmony-specific tokens
    Format, Harmony, Channels, Reasoning, Channel, Encoding,
    LParen, RParen, LBracket, RBracket, LCurly, RCurly,
    // Control flow keywords
    If, Else, For, Of, Step, Return,
    // Put Arrow before Equals and Colon
    Arrow, Equals, Colon,
    // Operators
    Dot,
    // Separators and punctuation
    Comma,
    // Rest of the tokens
    Text, Identifier, Semicolon, BacktickString,
    StringLiteral, NumberLiteral, BooleanLiteral,
    QuestionMark,
    // AnyToken should be last
    AnyToken
];

const NudgeLexer = new Lexer(allTokens);

class NudgeParser extends CstParser {
    constructor() {
        super(allTokens);

        const $ = this;

        $.RULE('program', () => {
            $.MANY(() => {
                $.SUBRULE($.prompt);
            });
        });

        $.RULE('prompt', () => {
            $.CONSUME(Prompt);
            $.CONSUME(Identifier);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.section);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('section', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.metaSection) },
                { ALT: () => $.SUBRULE($.contextSection) },
                { ALT: () => $.SUBRULE($.paramsSection) },
                { ALT: () => $.SUBRULE($.bodySection) },
                { ALT: () => $.SUBRULE($.constraintsSection) },
                { ALT: () => $.SUBRULE($.outputSection) },
                { ALT: () => $.SUBRULE($.hooksSection) },
                { ALT: () => $.SUBRULE($.techniqueSection) },
                { ALT: () => $.SUBRULE($.harmonySection) }
            ]);
        });

        $.RULE('metaSection', () => {
            $.CONSUME(Meta);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.field);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('contextSection', () => {
            $.CONSUME(Context);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.field);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('paramsSection', () => {
            $.CONSUME(Identifier);
            // In the future, we should validate that sectionName.image === "params"
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.paramField);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('bodySection', () => {
            $.CONSUME(Body);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.SUBRULE($.textBlock) },
                    { ALT: () => $.SUBRULE($.ifStatement) },
                    { ALT: () => $.SUBRULE($.forLoop) }
                ]);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('techniqueSection', () => {
            $.CONSUME(Technique);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.techniqueDef);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('constraintsSection', () => {
            $.CONSUME(Constraints);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.field);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('outputSection', () => {
            $.CONSUME(Output);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.SUBRULE($.field) },
                    { ALT: () => $.SUBRULE($.channelsBlock) }
                ]);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('channelsBlock', () => {
            $.CONSUME(Channels);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.channelDef);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('channelDef', () => {
            $.CONSUME(Identifier); // Channel name (final, analysis, commentary)
            $.CONSUME(Colon);
            $.SUBRULE($.value);
            $.OPTION(() => {
                $.CONSUME(Semicolon);
            });
        });

        $.RULE('hooksSection', () => {
            $.CONSUME(Hooks);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.hookDef);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('harmonySection', () => {
            $.CONSUME(Harmony);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.harmonyField);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('harmonyField', () => {
            $.OR([
                { ALT: () => $.CONSUME(Encoding) },
                { ALT: () => $.CONSUME(Reasoning) },
                { ALT: () => $.CONSUME(Channels) },
                { ALT: () => $.CONSUME(Identifier) }
            ]);
            $.CONSUME(Colon);
            $.SUBRULE($.value);
            $.OPTION(() => {
                $.CONSUME(Semicolon);
            });
        });

        $.RULE('field', () => {
            $.OR([
                { ALT: () => $.CONSUME(Identifier) },
                { ALT: () => $.CONSUME(Output) },    // Allow "output" as field name
                { ALT: () => $.CONSUME(Prompt) },    // Allow "prompt" as field name
                { ALT: () => $.CONSUME(Format) },    // Allow "format" as field name
                { ALT: () => $.CONSUME(Reasoning) }, // Allow "reasoning" as field name
                { ALT: () => $.CONSUME(Channels) }   // Allow "channels" as field name
            ]);
            $.CONSUME(Colon);
            $.SUBRULE($.value);
            $.OPTION(() => {
                $.CONSUME(Semicolon);
            });
        });

        $.RULE('type', () => {
            $.CONSUME(Identifier); // Base type
            $.OPTION(() => {
                $.CONSUME(LBracket);
                $.CONSUME(RBracket); // Array notation []
            });
        });

        $.RULE('paramField', () => {
            // Parameter name
            $.CONSUME(Identifier);

            // Handle optional parameter marker
            $.OPTION(() => $.CONSUME(QuestionMark));

            // Colon and type
            $.CONSUME(Colon);
            $.SUBRULE($.type); // Type annotation

            // Optional default value
            $.OPTION2(() => {
                $.CONSUME(Equals);
                return $.SUBRULE($.value);
            });

            // Optional semicolon
            $.OPTION3(() => $.CONSUME(Semicolon));
        });

        $.RULE('value', () => {
            $.OR([
                { ALT: () => $.CONSUME(StringLiteral) },
                { ALT: () => $.CONSUME(NumberLiteral) },
                { ALT: () => $.CONSUME(BooleanLiteral) },
                { ALT: () => $.SUBRULE($.textBlock) },
                { ALT: () => $.CONSUME(Identifier) },
                { ALT: () => $.SUBRULE($.objectLiteral) },
                { ALT: () => $.SUBRULE($.arrayLiteral) }
            ]);
        });

        $.RULE('textBlock', () => {
            $.CONSUME(Text);
            $.CONSUME(BacktickString);
        });

        $.RULE('objectLiteral', () => {
            $.CONSUME(LCurly);
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier);
                    $.CONSUME(Colon);
                    $.SUBRULE($.value);
                }
            });
            $.CONSUME(RCurly);
        });

        $.RULE('arrayLiteral', () => {
            $.CONSUME(LBracket);
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.SUBRULE($.value);
                }
            });
            $.CONSUME(RBracket);
        });

        $.RULE('ifStatement', () => {
            $.CONSUME(If);
            $.CONSUME(LParen);
            $.SUBRULE($.expression);
            $.CONSUME(RParen);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.textBlock);
            });
            $.CONSUME(RCurly);
            $.OPTION(() => {
                $.CONSUME(Else);
                $.CONSUME2(LCurly);
                $.MANY2(() => {
                    $.SUBRULE2($.textBlock);
                });
                $.CONSUME2(RCurly);
            });
        });

        $.RULE('forLoop', () => {
            $.CONSUME(For);
            $.CONSUME(LParen);
            $.CONSUME(Identifier);
            $.CONSUME(Of);
            $.SUBRULE($.expression);
            $.CONSUME(RParen);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.SUBRULE($.textBlock);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('expression', () => {
            // Parse primary expressions
            let left = $.OR([
                { ALT: () => $.CONSUME(Identifier) },
                { ALT: () => $.CONSUME(StringLiteral) },
                { ALT: () => $.CONSUME(NumberLiteral) },
                { ALT: () => $.CONSUME(BooleanLiteral) }
            ]);

            // Handle member access chain and function calls (like params.items, input.toUpperCase())
            $.MANY(() => {
                $.CONSUME(Dot);
                $.CONSUME2(Identifier);
                // Handle optional function call
                $.OPTION(() => {
                    $.CONSUME(LParen);
                    // Handle function arguments (simplified for now)
                    $.MANY_SEP({
                        SEP: Comma,
                        DEF: () => $.SUBRULE($.expression)
                    });
                    $.CONSUME(RParen);
                });
            });

            // Handle assignment expressions
            const hasAssignment = $.OPTION2(() => $.CONSUME(Equals));

            if (hasAssignment) {
                // Parse the right-hand side of the assignment
                $.SUBRULE3($.expression);
            }

            return left;
        });

        $.RULE('techniqueDef', () => {
            $.CONSUME(Identifier);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.SUBRULE($.field) },
                    { ALT: () => $.SUBRULE($.techniqueBlock) }, // New rule for nested blocks
                    { ALT: () => $.SUBRULE($.stepDef) }
                ]);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('techniqueBlock', () => {
            $.CONSUME(Identifier);
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.SUBRULE($.field) },
                    { ALT: () => $.SUBRULE($.textBlock) }
                ]);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('stepDef', () => {
            $.CONSUME(Step);
            $.OPTION(() => {
                $.CONSUME(LParen);
                $.CONSUME(StringLiteral);
                $.CONSUME(RParen);
            });
            $.CONSUME(LCurly);
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.SUBRULE($.field) },
                    { ALT: () => $.SUBRULE($.textBlock) }
                ]);
            });
            $.CONSUME(RCurly);
        });

        $.RULE('hookDef', () => {
            $.CONSUME(Identifier);
            $.OPTION(() => {
                $.CONSUME(LParen);
                $.MANY_SEP({
                    SEP: Comma,
                    DEF: () => $.CONSUME2(Identifier)
                });
                $.CONSUME(RParen);
            });
            $.CONSUME(LCurly);
            $.MANY(() => $.SUBRULE($.statement));
            $.CONSUME(RCurly);
        });

        $.RULE('statement', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.expression) },
                { ALT: () => $.SUBRULE($.ifStatement) },
                { ALT: () => $.SUBRULE($.forLoop) },
                { ALT: () => $.SUBRULE($.returnStatement) }
            ]);
            $.OPTION(() => $.CONSUME(Semicolon));
        });

        $.RULE('returnStatement', () => {
            $.CONSUME(Return);
            $.SUBRULE($.expression);
        });

        this.performSelfAnalysis();
    }
}

const parser = new NudgeParser();

class NudgeLangParser {
    parse(inputText) {
        const lexingResult = NudgeLexer.tokenize(inputText);
        parser.input = lexingResult.tokens;
        const cst = parser.program();

        if (parser.errors.length > 0) {
            throw new Error('Parsing errors detected: ' + parser.errors.map(err => err.message).join(', '));
        }

        // Convert CST to AST (you'll need to implement this conversion)
        return this.cstToAst(cst);
    }

    cstToAst(cst) {
        // Remove debug logs for production
        if (!cst.children || !cst.children.prompt) {
            return { type: 'Program', prompts: [] };
        }

        const prompts = cst.children.prompt.map(promptCst => {
            const name = promptCst.children.Identifier[0].image;

            const sections = promptCst.children.section ? promptCst.children.section.map(sectionCst => {
                const sectionType = Object.keys(sectionCst.children)[0];

                switch (sectionType) {
                    case 'bodySection': {
                        const bodySectionCst = sectionCst.children.bodySection[0];

                        const content = [];

                        // Handle text blocks
                        if (bodySectionCst.children && bodySectionCst.children.textBlock) {
                            bodySectionCst.children.textBlock.forEach(textBlockCst => {
                                content.push({
                                    type: 'TextBlock',
                                    content: textBlockCst.children.BacktickString[0].image,
                                });
                            });
                        }

                        // Handle if statements
                        if (bodySectionCst.children && bodySectionCst.children.ifStatement) {
                            bodySectionCst.children.ifStatement.forEach(_ifStatementCst => {
                                content.push({
                                    type: 'IfStatement',
                                // For now, just mark that we have an if statement
                                // We'll implement full parsing later
                                });
                            });
                        }

                        // Handle for loops
                        if (bodySectionCst.children && bodySectionCst.children.forLoop) {
                            bodySectionCst.children.forLoop.forEach(_forLoopCst => {
                                content.push({
                                    type: 'ForLoop',
                                // For now, just mark that we have a for loop
                                // We'll implement full parsing later
                                });
                            });
                        }

                        return {
                            type: 'body',  // Changed from 'BodySection' to 'body'
                            content,
                        };
                    }
                    case 'metaSection': {
                        return {
                            type: 'meta',  // Changed from 'MetaSection' to 'meta'
                        // For now, just return the type. We'll implement full parsing later
                        };
                    }

                    case 'paramsSection': {
                        const paramsSectionCst = sectionCst.children.paramsSection[0];

                        const fields = [];

                        // Handle param fields
                        if (paramsSectionCst.children && paramsSectionCst.children.paramField) {
                            paramsSectionCst.children.paramField.forEach(paramFieldCst => {
                                const field = {
                                    type: 'ParamField',
                                    name: paramFieldCst.children.Identifier[0].image,
                                    isOptional: !!paramFieldCst.children.QuestionMark,
                                };

                                // Handle default value if present
                                if (paramFieldCst.children.Equals) {
                                // Try to extract the default value
                                    const valueCst = paramFieldCst.children.value ? paramFieldCst.children.value[0] : null;
                                    if (valueCst) {
                                    // This is a simplified implementation
                                    // We could implement proper value extraction here
                                        if (valueCst.children.StringLiteral) {
                                            field.defaultValue = valueCst.children.StringLiteral[0].image;
                                        } else if (valueCst.children.NumberLiteral) {
                                            field.defaultValue = parseFloat(valueCst.children.NumberLiteral[0].image);
                                        } else if (valueCst.children.BooleanLiteral) {
                                            field.defaultValue = valueCst.children.BooleanLiteral[0].image === 'true';
                                        } else {
                                            field.defaultValue = valueCst.children.Identifier ?
                                                valueCst.children.Identifier[0].image :
                                                null;
                                        }
                                    }
                                }

                                fields.push(field);
                            });
                        }

                        return {
                            type: 'params',
                            fields,
                        };
                    }
                    case 'constraintsSection':
                        return {
                            type: 'constraints',  // Changed from 'ConstraintsSection' to 'constraints'
                        // For now, just return the type. We'll implement full parsing later
                        };

                    case 'outputSection':
                        return {
                            type: 'output',  // Changed from 'OutputSection' to 'output'
                        // For now, just return the type. We'll implement full parsing later
                        };

                    case 'hooksSection':
                        return {
                            type: 'hooks',  // Changed from 'HooksSection' to 'hooks'
                        // For now, just return the type. We'll implement full parsing later
                        };

                    case 'techniqueSection':
                        return {
                            type: 'technique',  // Changed from 'TechniqueSection' to 'technique'
                        // For now, just return the type. We'll implement full parsing later
                        };

                    case 'contextSection':
                        return {
                            type: 'context',  // Changed from 'ContextSection' to 'context'
                        // For now, just return the type. We'll implement full parsing later
                        };

                    case 'harmonySection':
                        return {
                            type: 'harmony',
                            fields: sectionCst.children.harmonyField?.map(fieldCst => ({
                                name: this.extractHarmonyFieldName(fieldCst),
                                value: this.extractHarmonyFieldValue(fieldCst)
                            })) || []
                        };

                    default:
                    // Handle other section types similarly
                        return {
                            type: sectionType,
                        // Add more properties based on the section type
                        };
                }
            }) : [];

            return {
                type: 'Prompt',
                name,
                sections,
            };
        });

        return {
            type: 'Program',
            prompts,
        };
    }

    extractHarmonyFieldName(fieldCst) {
        if (fieldCst.children.Identifier) {
            return fieldCst.children.Identifier[0].image;
        } else if (fieldCst.children.Encoding) {
            return 'encoding';
        } else if (fieldCst.children.Reasoning) {
            return 'reasoning';
        } else if (fieldCst.children.Channels) {
            return 'channels';
        }
        return 'unknown';
    }

    extractHarmonyFieldValue(fieldCst) {
        if (fieldCst.children.value && fieldCst.children.value[0]) {
            const valueCst = fieldCst.children.value[0];
            if (valueCst.children.StringLiteral) {
                return valueCst.children.StringLiteral[0].image.slice(1, -1); // Remove quotes
            } else if (valueCst.children.Identifier) {
                return valueCst.children.Identifier[0].image;
            } else if (valueCst.children.arrayLiteral) {
                // Handle array literals for channels
                return this.extractArrayValue(valueCst.children.arrayLiteral[0]);
            }
        }
        return null;
    }

    extractArrayValue(arrayLiteralCst) {
        const elements = [];
        if (arrayLiteralCst.children.value) {
            arrayLiteralCst.children.value.forEach(valueCst => {
                if (valueCst.children.StringLiteral) {
                    elements.push(valueCst.children.StringLiteral[0].image.slice(1, -1));
                } else if (valueCst.children.Identifier) {
                    elements.push(valueCst.children.Identifier[0].image);
                }
            });
        }
        return elements;
    }
}

module.exports = NudgeLangParser;
module.exports.NudgeLexer = NudgeLexer;
