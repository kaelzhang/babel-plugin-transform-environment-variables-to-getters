const plugin = require('..')

const ERRORS = [
  [{}, 'INVALID_ENV_FILE_PATH'],
  [{
    envFilepath: 1
  }, 'INVALID_ENV_FILE_PATH'],
  [{
    envFilepath: 'a',
    getterIdentifier: 1,
  }, 'INVALID_GETTER_IDENTIFIER']
]

const mockApi = {
  assertVersion () {}
}

describe('errors', () => {
  ERRORS.forEach(([options, code]) => {
    it(JSON.stringify(options), () => {
      try {
        plugin(mockApi, options)
      } catch (err) {
        expect(err.code).toBe(code)
        expect(err).toBeInstanceOf(TypeError)
        return
      }

      throw new Error('should throw')
    })
  })
})
