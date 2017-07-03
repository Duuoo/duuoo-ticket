const jwt = require('jsonwebtoken')

module.exports =
function ticket (secretOrPrivateKey, signOptions) {
  return {
    sign (payload, options = {}) {
      return jwt.sign(payload, secretOrPrivateKey, Object.assign({}, signOptions, options))
    },
    verify (token, options) {
      return jwt.verify(token, secretOrPrivateKey, options)
    },
    decode (token, options) {
      return jwt.decode(token, options)
    },
  }
}

module.exports.TokenExpiredError = jwt.TokenExpiredError
module.exports.JsonWebTokenError = jwt.JsonWebTokenError
module.exports.NotBeforeError = jwt.NotBeforeError
