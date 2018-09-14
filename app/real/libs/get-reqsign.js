const _ = require('lodash')
const crypto = require('crypto')
const urlencode = require('urlencode')

// getReqsign ：根据 接口请求参数 和 应用密钥 计算 请求签名
function getReqsign (params, appkey) {
  // 根据key排序
  params = objKeySort(params)
  // 拼url键值对
  let str = ''
  const arr = Object.keys(params)
  for (let i = 0; i < arr.length; i++) {
    if (params[arr[i]]) { str += arr[i] + '=' + urlencode(params[arr[i]]) + '&' }
  }
  str += 'app_key=' + appkey
  // md5加密 + 转化为大写
  const hash = crypto.createHash('md5')
  hash.update(str)
  let sign = _.toUpper(hash.digest('hex'))
  return sign
}

// 根据key排序
function objKeySort (arr) {
  const newkey = Object.keys(arr).sort()
  const newObj = {}
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = arr[newkey[i]]
  }
  return newObj
}

/*
const params = {
  app_id: '2108466055',
  time_stamp: '1536845119',
  nonce_str: '20e3408a79',
  key1: '腾讯AI开放平台',
  key2: '示例仅供参考',
  sign: ''
}

const appkey = 'a95eceb1ac8c24ee28b70f7dbba912bf'

params['sign'] = getReqsign(params, appkey)

console.log(params)

*/
module.exports = getReqsign
