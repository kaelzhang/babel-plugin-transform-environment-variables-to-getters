const __getProcessEnvs = require('../../envs')

process.env.TEVTG_FOO

expect(process.env.TEVTG_FOO).toBe('bar')
