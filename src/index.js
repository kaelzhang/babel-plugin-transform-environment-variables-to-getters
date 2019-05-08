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
            path.replaceWith(t.valueToNode(process.env[key.value]))
          }
        }
      }
    }
  }
}

declare.DEFAULT_REQUIRE = DEFAULT_REQUIRE

module.exports = declare
