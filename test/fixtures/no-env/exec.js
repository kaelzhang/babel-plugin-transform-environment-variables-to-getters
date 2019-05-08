const getEnv = key => process.env[key]

expect(getEnv('FOO')).toBe('foo2')
