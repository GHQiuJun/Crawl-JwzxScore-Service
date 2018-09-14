const _ = require('lodash')

module.exports = x => {
  x = _.trim(_.replace(x, /\t|\n|√/g, ' '))
  x = _.replace(x, /\s+/g, ' ')
  x = _.replace(x, /√/g, 1)
  x = _.split(x, ' ')
  return x
}
