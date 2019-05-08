const {
  types: t
} = require('@babel/core')

const DEFAULT_REQUIRE = '__PROCESS_ENVS_GETTER__'

const REGEX_MATCH_QUOTED = /^(["'])(.*)\1$/

const argument = arg => {
  if (!arg) {
    return t.identifier(DEFAULT_REQUIRE)
  }

  const match = arg.match(REGEX_MATCH_QUOTED)
  if (!match) {
    return t.identifier(arg)
  }

  return t.stringLiteral(match[2])
}

const declare = (api, {
  require: requireArgument
} = {}) => {
  api.assertVersion(7)

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
            t.identifier('__getProcessEnvs'),
            // init
            t.callExpression(
              // callee
              t.identifier('require'),
              [
                argument(requireArgument)
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
          if (t.isStringLiteral(key)) {
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
                t.identifier('__getProcessEnvs'),
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

declare.DEFAULT_REQUIRE = DEFAULT_REQUIRE

module.exports = declare
