const {
  Errors,
  exitOnNotDefined
} = require('err-object')

const {name} = require('../package.json')

const {error, E} = new Errors({
  notDefined: exitOnNotDefined,
  prefix: `[${name}] `
})

const BUT_GOT = ', but got `%j`'

const TE = (code, message) => E(
  `INVALID_${code}`,
  `${message}${BUT_GOT}`,
  TypeError
)

TE('ENV_FILE_PATH', 'options.envFilepath must be a string')
TE('GETTER_IDENTIFIER', 'options.getterIdentifier must be a string')
TE('INCLUDE', 'options.include must be an array of string(s) or undefined')
TE('EXCLUDE', 'options.exclude must be an array of string(s) or undefined')

module.exports = {
  error
}
