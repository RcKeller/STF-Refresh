const image = require('./image')
const javascript = require('./javascript')
const css = require('./css')
const less = require('./less')

module.exports = ({ production = false, browser = false } = {}) => (
  [
    javascript({ production, browser }),
    less(),
    css({ production, browser }),
    image()
  ]
)
