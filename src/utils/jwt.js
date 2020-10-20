const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

// 创建Token类
class Jwt {
  constructor (data) {
    this.data = data
  }

  // 生成token
  generateToken () {
    const { data } = this
    const createdTime = Math.floor(Date.now() / 1000)
    const cert = fs.readFileSync(path.join(process.cwd(), '../src/rsa_key/rsa_private_key.pem')) // 私钥
    const token = jwt.sign({
      data,
      exp: createdTime + 60 * 30
    }, cert, {
      algorithm: 'RS256'
    })
    return token
  }

  // 校验token
  verifyToken () {
    const token = this.data
    const cert = fs.readFileSync(path.join(process.cwd(), '../src/rsa_key/rsa_public_key.pem')) // 公钥
    let res
    try {
      const result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {}
      const { exp = 0 } = result; const current = Math.floor(Date.now() / 1000)
      if (current <= exp) {
        res = result.data || {}
      }
    } catch (e) {
      res = 'error'
    }
    return res
  }
}

module.exports = Jwt
