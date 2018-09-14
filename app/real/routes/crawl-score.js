const crawlJwzx = require('../libs/crawl-jwzx')

module.exports = (fastify) => async (request, reply) => {
  fastify.log.info('开始抓取成绩...')
  let score = false
  let count = 1
  // 验证码验证重试和重试的最大次数
  while (score === false && count <= 8) {
    fastify.log.info('第' + count + '次抓取...')
    score = await crawlJwzx(fastify, request.query.user, request.query.psd).catch(error => fastify.log.error(error))
    count++
  }
  if (score !== false) {
    fastify.log.info('成绩抓取成功,共尝试' + --count + '次...')
    return {res: true, data: score}
  }
  fastify.log.error('成绩抓取失败...')
  return {res: false, message: '成绩抓取失败，共尝试' + --count + '次...'}
}
