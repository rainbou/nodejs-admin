const cors = require('cors')
const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), './') + 'config.json'))
const { allowOrigins } = config

const corsOptions = {
  origin: (origin, callback) => {
    if (allowOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('目标服务器拒绝了您发起的请求，请联系管理员'))
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
  maxAge: 3600,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

module.exports = () => cors(corsOptions)
