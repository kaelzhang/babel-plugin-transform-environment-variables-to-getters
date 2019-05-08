const {
  types: t
} = require('@babel/core')

module.exports = api => {
  api.assertVersion(7)

  return {
    name: 'transform-environment-variables-to-getters',

    visitor: {
      MemberExpression (path, {opts: {include, exclude} = {}}) {
        if (path.get('object').matchesPattern('process.env')) {
          const key = path.toComputedKey()
          if (
            t.isStringLiteral(key)
            && (!include || include.indexOf(key.value) !== - 1)
            && (!exclude || exclude.indexOf(key.value) === - 1)
          ) {
            path.replaceWith(t.valueToNode(process.env[key.value]))
          }
        }
      }
    }
  }
}
