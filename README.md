# Laskin.js

[![github][github-image]][github-url]
[![coveralls][coveralls-image]][coveralls-url]

[github-image]: https://github.com/RauliL/laskin.js/actions/workflows/test.yml/badge.svg
[github-url]: https://github.com/RauliL/laskin.js/actions/workflows/test.yml
[coveralls-image]: https://coveralls.io/repos/github/RauliL/laskin.js/badge.svg
[coveralls-url]: https://coveralls.io/github/RauliL/laskin.js

Rewrite of [Laskin] calculator tool / programming language in JavaScript, since
I couldn't get it to compile into WebAssembly.

Has 99% of the features that the original one has, with 2 times uglier
codebase. It works both in Node.js and Web browsers.

[Laskin]: https://github.com/RauliL/laskin

## Installation

```bash
$ npm install laskin
```

## Usage

```TypeScript
import { Context } from 'laskin';

// Create new execution context.
const c = new Context();

// Execute some Laskin source code inside the context.
c.exec('15 dup * .');

// By default all lines are outputted with `console.log` function, but this
// behavior can be overridden by giving a second argument to the `exec` method.
c.exec(
  '", " 1 11 range join .',
  (line) => process.stderr.write(`${line}\n`)
);
```
