const express = require('express')
const app = express.Router()

// 登录
app.post('/login', (req, res, next) => {
  res.json({
    status: 20000,
    message: 'login success'
  })
})

// 获取登录信息
app.get('/login/info', (req, res, next) => {

})

// 退出登录
app.post('/logout', (req, res) => {

})

module.exports = app
