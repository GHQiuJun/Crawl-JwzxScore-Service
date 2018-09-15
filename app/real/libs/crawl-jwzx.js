const puppeteer = require('puppeteer')
const fs = require('fs')
const getReqSign = require('./get-reqsign')
const regex = require('./regex')
const axios = require('axios')
const _ = require('lodash')
const randomStr = require('randomstring')
const scoreUrl = 'http://jwzx.cqu.pt/student/chengjiPm.php'
const loginUrl = 'http://jwzx.cqu.pt/login.php'
const querystring = require('querystring')
const qrCodeUrl = 'https://api.ai.qq.com/fcgi-bin/nlp/nlp_imagetranslate'
const config = require('../config')

const appkey = config.appKey

async function crawlJwzx (fastify, user, psd) {
  const params = {
    app_id: config.appId,
    image: '',
    session_id: randomStr.generate({
      length: 12,
      charset: '0123456789'
    }),
    scene: 'doc',
    source: 'en',
    target: 'zh',
    time_stamp: parseInt(Date.now() / 1000),
    nonce_str: randomStr.generate({
      length: 12,
      charset: 'abcqwertyuasdf0123456789'
    }),
    sign: ''
  }
  // start headless browser
  const browser = await puppeteer.launch({headless: true})
  // login page
  const page = await browser.newPage()
  await page.goto(loginUrl)
  await page.waitFor('#login-jw').catch(async err => {
    fastify.log.error(err)
    await browser.close()
    return false
  })

  // 获取二维码
  const image = await page.waitForSelector('.vCodePic')
  await image.screenshot({
    path: './' + user + '.png',
    omitBackground: false,
    width: 50,
    height: 20
  })
  // 根据腾讯API识别二维码
  const bitmap = fs.readFileSync('./' + user + '.png')
  const base64Image = new Buffer(bitmap).toString('base64')
  fs.unlinkSync('./' + user + '.png')
  params['image'] = base64Image
  params['sign'] = getReqSign(params, appkey)
  // 请求API
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  const res = await axios.post(qrCodeUrl, querystring.stringify(params))
  // 如果识别图片失败，返回false
  if (res.data.msg !== 'ok') {
    fastify.log.error('验证码识别失败...')
    await browser.close()
    return false
  }
  const code = res.data.data.image_records[0].source_text
  // login
  await page.type('#loginForm > input:nth-child(2)', user)
  await page.type('#loginForm > input:nth-child(5)', psd)
  await page.type('#loginForm > input:nth-child(8)', code.replace(/\s+/g, ''))
  await page.click('#loginSubmitButton')
  // 对验证码错误的处理,不是很熟悉puppeteer，目前只想到通过错误来捕获错误
  page.on('dialog', async dialog => {
    await dialog.accept()
    await browser.close()
  })
  try {
    // go to score
    await page.goto(scoreUrl)
  } catch (e) {
    fastify.log.error('验证码识别错误...')
    return false
  }
  await page.waitFor('#cjAllTab-cjzb > div:nth-child(1) > b:nth-child(1)').catch(async err => {
    fastify.log.error(err)
    await browser.close()
    return false
  })
  // 抓取需要的内容
  let score = {
    'zbA': [],
    'zbB': [],
    'xfTj': []
  }
  // 成绩总表A
  score['zbA'] = (await page.$$eval('#bzyTable > tbody > tr', eles => eles.map(ele => ele.innerText)))
  score['zbA'] = score['zbA'].map(regex)
  // 成绩总表B
  score['zbB'] = await page.$$eval('#bxfTable > tbody > tr', eles => eles.map(ele => ele.innerText))
  score['zbB'].map(x => _.trim(_.replace(x, '\t', ' ')))
  score['zbB'] = score['zbB'].map(regex)
  // GPA
  score['xfTj'] = await page.$$eval('#AxfTjTable > tbody > tr', eles => eles.map(ele => ele.innerText))
  score['xfTj'] = _.concat(score['xfTj'], await page.$$eval('#bxfTjTable > tbody > tr', eles => eles.map(ele => ele.innerText)))
  score['xfTj'] = score['xfTj'].map(regex)
  await browser.close()
  return score
}

module.exports = crawlJwzx
