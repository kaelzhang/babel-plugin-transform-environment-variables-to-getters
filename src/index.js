const {
  types: t
} = require('@babel/core')
const {isString, isArray, isUndefined} = require('core-util-is')

const {error} = require('./error')

const DEFAULT_GETTER_IDENDIFIER = '__getProcessEnvs'

const isArrayStringOrUndefined = arr => isUndefined(arr)
  || isArray(arr) && arr.every(isString)

const declare = (api, {
  envFilepath,
  getterIdentifier = DEFAULT_GETTER_IDENDIFIER,
  include,
  exclude
} = {}) => {
  api.assertVersion(7)

  if (!isString(envFilepath)) {
    throw error('INVALID_ENV_FILE_PATH', envFilepath)
  }

  if (!isString(getterIdentifier)) {
    throw error('INVALID_GETTER_IDENTIFIER', getterIdentifier)
  }

  if (!isArrayStringOrUndefined(include)) {
    throw error('INVALID_INCLUDE', include)
  }

  if (!isArrayStringOrUndefined(exclude)) {
    throw error('INVALID_EXCLUDE', exclude)
  }

  let program
  let has

  return {
    name: 'transform-environment-variables-to-getters',

    pre ({ast}) {
      has = false

      if (t.isFile(ast)) {
        ({program} = ast)
      }

      if (t.isProgram(ast)) {
        program = ast
      }

      // TODO:
      // handle the scenario that
      // use passed a sub ast tree with scope context
    },

    post () {
      const p = program
      program = null

      if (!has) {
        return
      }

      const node = t.variableDeclaration(
        // kind
        'const',
        // declarations
        [
          t.variableDeclarator(
            // id
            t.identifier(getterIdentifier),
            // init
            t.callExpression(
              // callee
              t.identifier('require'),
              [
                t.stringLiteral(envFilepath)
              ]
            )
          )
        ]
      )

      p.body.unshift(node)
    },

    visitor: {
      MemberExpression (path) {
        if (path.get('object').matchesPattern('process.env')) {
          const key = path.toComputedKey()
          if (
            t.isStringLiteral(key)
            && (!include || include.indexOf(key.value) !== - 1)
            && (!exclude || exclude.indexOf(key.value) === - 1)
          ) {
            has = true

            // Ref: @babel/types/src/definitions/core.js
            // ```
            // defineType("MemberExpression", {
            //   builder: []
            // }
            // ```
            const node = t.memberExpression(
              // object
              t.callExpression(
                // callee
                t.identifier(getterIdentifier),
                // arguments
                []
              ),
              // property
              t.identifier(key.value)
              // computed
              // optional
            )

            path.replaceWith(node)
          }
        }
      }
    }
  }
}

declare.DEFAULT_GETTER_IDENDIFIER = DEFAULT_GETTER_IDENDIFIER

module.exports = declare
