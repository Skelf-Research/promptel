# Promptel Grammar Specification

## Overall Structure
```
program := prompt*

prompt := "prompt" IDENTIFIER "{" section* "}"

section := metaSection 
         | contextSection 
         | paramsSection 
         | bodySection 
         | constraintsSection 
         | outputSection 
         | hooksSection 
         | techniqueSection
```

## Meta Section
```
metaSection := "meta" "{" field* "}"

field := IDENTIFIER ":" value ";"
```

## Context Section
```
contextSection := "context" "{" field* "}"
```

## Params Section
```
paramsSection := "params" "{" paramField* "}"

paramField := IDENTIFIER ":" typeAnnotation defaultValue? ";"
           | IDENTIFIER "?" ":" typeAnnotation ";"

typeAnnotation := "string" | "number" | "boolean" | "string[]" | "number[]" | "boolean[]" | IDENTIFIER

defaultValue := "=" literal
```

## Body Section
```
bodySection := "body" "{" bodyContent* "}"

bodyContent := textBlock 
             | ifStatement 
             | forLoop 
             | techniqueBlock

textBlock := "text" BACKTICK_STRING

ifStatement := "if" "(" expression ")" "{" bodyContent* "}" 
               ("else" "{" bodyContent* "}")?

forLoop := "for" "(" IDENTIFIER "of" expression ")" "{" bodyContent* "}"

techniqueBlock := "technique" "{" techniqueDef* "}"

techniqueDef := IDENTIFIER "{" (field | stepDef | techniqueDef)* "}"

stepDef := "step" "(" STRING_LITERAL ")" "{" textBlock* "}"
```

## Constraints Section
```
constraintsSection := "constraints" "{" field* "}"
```

## Output Section
```
outputSection := "output" "{" field* "}"
```

## Hooks Section
```
hooksSection := "hooks" "{" hookDef* "}"

hookDef := IDENTIFIER ":" functionDefinition
         | IDENTIFIER ":" value

functionDefinition := "(" paramList? ")" "=>" "{" statement* "}"

paramList := IDENTIFIER ("," IDENTIFIER)*

statement := expression ";"
           | ifStatement
           | forLoop
           | returnStatement

returnStatement := "return" expression
```

## Technique Section
```
techniqueSection := "technique" "{" techniqueDef* "}"
```

## Values and Expressions
```
value := literal 
       | textBlock 
       | IDENTIFIER 
       | objectLiteral 
       | arrayLiteral

literal := STRING_LITERAL 
         | NUMBER_LITERAL 
         | BOOLEAN_LITERAL

objectLiteral := "{" (IDENTIFIER ":" value ("," IDENTIFIER ":" value)*)? "}"

arrayLiteral := "[" (value ("," value)*)? "]"

expression := IDENTIFIER 
            | literal 
            | IDENTIFIER "." IDENTIFIER  // e.g., params.name
            | expression "+" expression
            | expression "-" expression
            | expression "*" expression
            | expression "/" expression
            | expression "==" expression
            | expression "!=" expression
            | expression ">" expression
            | expression "<" expression
            | expression ">=" expression
            | expression "<=" expression
            | "(" expression ")"
```

## Lexical Tokens
```
IDENTIFIER := [a-zA-Z][a-zA-Z0-9_]*
STRING_LITERAL := "\"" ([^\"\\\\] | \\\\.)"*\""
NUMBER_LITERAL := -?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?
BOOLEAN_LITERAL := "true" | "false"
BACKTICK_STRING := "`" ([^`] | \\.)* "`"
```