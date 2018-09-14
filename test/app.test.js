const Fastify = require('fastify')
const checkAppEnv = require('fastify-practice/main/check-app-env')
const buildAppPlugin = require('fastify-practice/main/build-app-plugin')

const appName = 'real'

checkAppEnv(appName)
const appPlugin = buildAppPlugin(appName)

describe('App', () => {
  let fastify = null

  beforeAll(async () => {
    fastify = Fastify()
    fastify.register(appPlugin)
    await fastify.ready()
  })

  afterAll(() => {
    fastify.close()
    fastify = null
  })

  describe('GET /crawl-score', () => {
    it('should get score', async () => {
      // ....
    })
  })
})
