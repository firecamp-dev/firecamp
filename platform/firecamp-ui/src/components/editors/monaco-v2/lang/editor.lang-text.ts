export default {
  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',
  keywords: ['IF', 'THEN', 'END', 'WHILE', 'DO', 'ELSE'],
  typeKeywords: [],
  operators: ['=', '>', '<', '==', '<=', '>=', '!=', '<>', '+', '-', '*', '/'],
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      // [
      //   /[a-z_$][\w$]*/,
      //   {
      //     cases: {
      //       "@typeKeywords": "keyword",
      //       "@keywords": "keyword",
      //       "@default": "identifier"
      //     }
      //   }
      // ],

      //firecamp
      [/:\d{2,5}/g, 'port'], //port
      [/(\{\{[-$\w]*\}\})/, 'variable'], // /{{var}} {{$mock}} {{x-api-key}}

      // [/\[error.*/, "custom-error"],
      // [/\[notice.*/, "custom-notice"],
      // [/\[info.*/, "custom-info"],
      [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],

      //firecamp

      // [/[A-Z][\w\$]*/, "type.identifier"], // to show class names nicely
      // whitespace
      // { include: "@whitespace" },
      // delimiters and operators
      // [/[{}()\[\]]/, "@brackets"],
      // @ annotations.
      // As an example, we emit a debugging log message on these tokens.
      // Note: message are supressed during the first load -- change some lines to see them.
      // eslint-disable-next-line no-useless-escape
      // [
      //   /@\s*[a-zA-Z_\$][\w\$]*/,
      //   { token: "annotation", log: "annotation token: $0" }
      // ],
      // numbers
      // [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      // [/0[xX][0-9a-fA-F]+/, "number.hex"],
      // [/\d+/, "number"],
      // // delimiter: after number because of .\d floats
      // [/[;,.]/, "delimiter"],
      // // strings
      // [/"([^"\\]|\\.)*$/, "string.invalid"],
      // // non-terminated string
      // [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      // // characters
      // [/'[^\\']'/, "string"],
      // [/'/, "string.invalid"]
    ],
    comment: [
      // [/[^\/*]+/, 'comment'],
      // [/\/\*/, 'comment', '@push'],
      // nested comment
      // ['\\*/', 'comment', '@pop'],
      // [/[\/*]/, 'comment']
    ],
    string: [
      // [/[^\\"]+/, 'string'],
      // [/\\./, 'string.escape.invalid'],
      // [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ],
    whitespace: [
      // [/[ \t\r\n]+/, 'white'],
      // [/\/\*/, 'comment', '@comment'],
      // [/\/\/.*$/, 'comment'],
    ],
  },
};
