const {
  types: t
} = require('@babel/core')

const DEFAULT_REQUIRE = '__PROCESS_ENVS_GETTER__'

const declare = (api, {
  require: requireArgument = DEFAULT_REQUIRE
} = {}) => {
  api.assertVersion(7)

  return {
    name: 'transform-environment-variables-to-getters',

    visitor: {
      MemberExpression (path) {
        if (path.get('object').matchesPattern('process.env')) {
          const key = path.toComputedKey()
          if (t.isStringLiteral(key)) {
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
