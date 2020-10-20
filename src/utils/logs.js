const log4js = require('log4js')

class Logger {
  constructor () {
    this.log4js = log4js
  }

  /**
   * 初始化
   * log级别：ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
   * */
  init () {
    const { log4js } = this
    log4js.configure({
      appenders: {
        console: { // 记录器1：输出到控制台
          type: 'console'
        },
        business_log_file: {
          type: 'dateFile',
          filename: process.cwd() + '/logs/businessLog',
          alwaysIncludePattern: true, // 将模式包含在当前日志文件的名称和备份中
          daysToKeep: 10, // 时间文件保存天数，10天之后内容将被删除
          pattern: '-yyy-MM-dd-hh.log', // 用于确定何时滚动日志模式，格式：.yyyy-MM-dd-hh:mm:ss.log
          encoding: 'utf-8' // 文件编码
          // compress: true// 是否压缩
        },
        system_log_file: {
          type: 'dateFile',
          filename: process.cwd() + '/logs/systemLog',
          alwaysIncludePattern: true, // 将模式包含在当前日志文件的名称和备份中
          daysToKeep: 10, // 时间文件保存天数，10天之后内容将被删除
          pattern: '-yyy-MM-dd-hh.log', // 用于确定何时滚动日志模式，格式：.yyyy-MM-dd-hh:mm:ss.log
          encoding: 'utf-8' // 文件编码
          // compress: true// 是否压缩
        }
      },
      categories: {
        default: {
          appenders: ['console', 'business_log_file'],
          level: 'info'
        },
        console: {
          appenders: ['console'],
          level: 'debug'
        },
        business: {
          appenders: ['business_log_file'],
          level: 'info'
        },
        system: {
          appenders: ['system_log_file'],
          level: 'warn'
        }
      }
    })
  }

  businessLogger (level, message) {
    const { log4js } = this
    const logger = log4js.getLogger('business')
    switch (level) {
      case 'info': {
        logger.info(message)
        break
      }
      case 'warn': {
        logger.warn(message)
        break
      }
      case 'error': {
        logger.error(message)
        break
      }
    }
  }

  systemLogger (level, message) {
    const { log4js } = this
    const logger = log4js.getLogger('system')
    switch (level) {
      case 'warn': {
        logger.warn(message)
        break
      }
      case 'error': {
        logger.error(message)
        break
      }
    }
  }

  getLogger (category) {
    const { log4js } = this
    if (!category || (category !== 'business' && category !== 'system')) {
      return log4js.getLogger()
    }
    return log4js.getLogger(category)
  }
}

module.exports = new Logger()
