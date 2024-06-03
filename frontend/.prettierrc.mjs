// module.exports = {
//   semi: true,
//   trailingComma: "all",
//   singleQuote: true,
//   printWidth: 100,
//   tabWidth: 6,
//   useTabs: false,
//   quoteProps: "as-needed",
//   bracketSpacing: true,
//   arrowParens: "always",
//   endOfLine: "lf",
//   jsxBracketSameLine: false,
//   htmlWhitespaceSensitivity: "strict",
//   overrrides: [
//     {
//       files: "**/package.json",
//       options: {
//         tabWidth: 2,
//         useTabs: false,
//       },
//     },
//   ],
// };

/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'es5', // add trailing commas in objects, arrays, etc.
  tabWidth: 2, // "visual width" of of the "tab"
  semi: true, // add ; when needed
  singleQuote: true, // '' for stings instead of ""
  printWidth: 100, // max 100 chars in line, code is easy to read
  useTabs: false, // use spaces instead of tabs
  bracketSpacing: true, // import { some } ... instead of import {some} ...
  arrowParens: 'always', // braces even for single param in arrow functions (a) => { }
  jsxSingleQuote: false, // "" for react props, like in html
  bracketSameLine: false, // pretty JSX
  endOfLine: 'lf', // 'lf' for linux, 'crlf' for windows, we need to use 'lf' for git
};

export default config;
