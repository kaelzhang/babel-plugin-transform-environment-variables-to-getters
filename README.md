[![Build Status](https://travis-ci.org/kaelzhang/babel-plugin-transform-environment-variables-to-getters.svg?branch=master)](https://travis-ci.org/kaelzhang/babel-plugin-transform-environment-variables-to-getters)
[![Coverage](https://codecov.io/gh/kaelzhang/babel-plugin-transform-environment-variables-to-getters/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/babel-plugin-transform-environment-variables-to-getters)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/babel-plugin-transform-environment-variables-to-getters?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/babel-plugin-transform-environment-variables-to-getters)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/babel-plugin-transform-environment-variables-to-getters.svg)](http://badge.fury.io/js/babel-plugin-transform-environment-variables-to-getters)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/babel-plugin-transform-environment-variables-to-getters.svg)](https://www.npmjs.org/package/babel-plugin-transform-environment-variables-to-getters)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/babel-plugin-transform-environment-variables-to-getters.svg)](https://david-dm.org/kaelzhang/babel-plugin-transform-environment-variables-to-getters)
-->

# babel-plugin-transform-environment-variables-to-getters

The babel plugin to transform inline environment variables to value getters

## Install

```sh
$ npm i babel-plugin-transform-environment-variables-to-getters
```

## Example

### In

```js
console.log(process.env.NODE_ENV)
```

### Out

#### Via `.babelrc` without options

```js
{
  "plugins": ["transform-environment-variables-to-getters"]
}
```
Out

```js
// Cooperate with webpack.DefinePlugin,
// then we can change __PROCESS_ENVS_GETTER__
const __getProcessEnvs = require(__PROCESS_ENVS_GETTER__)

console.log(__getProcessEnvs().NODE_ENV)
```

#### Via `.babelrc` with options

```js
{
  "plugins": ["transform-environment-variables-to-getters", {
    "require": "/path/to/get-env.js"
  }]
}
```
Out

```js
const __getProcessEnvs = require('/path/to/get-env.js')

console.log(__getProcessEnvs().NODE_ENV)
```

## License

[MIT](LICENSE)
