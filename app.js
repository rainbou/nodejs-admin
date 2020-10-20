const express = require('express')
const fs = require('fs')
const app = express()
const path = require('path')
const bodyPaser = require('body-parser')
const tempDirPath = path.join(process.cwd(), './') + '/tempdir'
const logger = require('./src/utils/logs')
const cors = require('./src/utils/cors')
const JwtUtil = require('./src/utils/jwt')

app.use(logger.log4js.connectLogger(logger.getLogger(), { level: 'auto', format: ':method :url :status   :response-time ms' }))

app.use(bodyPaser.json())
app.use(bodyPaser.urlencoded({ extended: true }))

app.use(cors())
app.use((req, res, next) => {
  if (req.url !== '/user/login') {
    const token = req.headers.token
    const jwt = new JwtUtil(token)
    const result = jwt.verifyToken()
    if (result === 'error') {
      res.json({
        status: 403,
        message: '登录已过期，请重新登录'
      })
    } else {
      next()
    }
  }
})
// // 添加请求头，处理跨域
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With')
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
//   res.header('X-Powered-By', ' 3.2.1')
//   res.header('Content-Type', 'application/json;charset=utf-8')
//   next()
// })

// 创建临时文件夹tempdir,用于文件的临时存储读写操作
fs.readdir(tempDirPath, (err, files) => {
  if (err) {
    fs.mkdir(tempDirPath, (e) => {
      if (e) {
        console.log(e)
        logger.systemLogger('error', JSON.stringify(e))
      }
    })
  }
})

// 读取配置文件config.json文件配置，启动nodejs服务
fs.readFile(path.join(process.cwd(), './config.json'), (err, data) => {
  if (err) {
    console.log(err)
    logger.systemLogger('error', JSON.stringify(err))
  } else {
    const { servePort } = JSON.parse(data.toString())
    app.listen(servePort, () => {
      console.log(`listening port ${servePort}`)
    })
  }
})
