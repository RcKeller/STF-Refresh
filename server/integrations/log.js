import winston from 'winston'
import path from 'path'
import config from 'config'
//  http://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/
//  http://tostring.it/2014/06/23/advanced-logging-with-nodejs/

class Logger {
  constructor () {
    console.log('LOGS: Initializing Action Logging')
    this.logDir = path.resolve(process.cwd(), 'logs')
    this.filename = config.has('prod') ? `${this.logDir}/-STF-WEB.log` : `${this.logDir}/-STF-DEV.log`
    //  { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
    this.logger = new winston.Logger({
      transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
          level: 'info',
          timestamp: this.time,
          colorize: true
        }),
        new (require('winston-daily-rotate-file'))({
          name: 'dailylogging',
          level: 'debug',
          json: false,
          timestamp: this.timeWithoutDate,
          filename: this.filename,
          datePattern: 'dd-MM-yyyy',
          prepend: true
        })
      ]
    })

    console.log(`LOGS: Logging services enabled - ${this.logDir}`)
  }

  timeWithoutDate () {
    return new Date().toLocaleTimeString()
  }

  timeWithDate () {
    const date = new Date()
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  log (message, encoding) {
    try {
      this.info(message)
    } catch (err) {
      console.error('LOGS:', err)
    }
  }
  error (message, encoding) {
    try {
      this.logger.error(message)
    } catch (err) {
      console.error('LOGS:', err)
    }
  }
  warn (message, encoding) {
    try {
      this.logger.warn(message)
    } catch (err) {
      console.error('LOGS:', err)
    }
  }
  info (message, encoding) {
    try {
      this.logger.info(message)
    } catch (err) {
      console.error('LOGS:', err)
    }
  }
  verbose (message, encoding) {
    try {
      this.logger.verbose(message)
    } catch (err) {
      console.error('LOGS:', err)
    }
  }
  debug (message, encoding) {
    try {
      this.logger.debug(message)
    } catch (err) {
      console.error('LOGS:', err)
    }
  }
  silly (message, encoding) {
    try {
      this.logger.silly(message)
    } catch (err) {
      console.error('LOGS:', err)
    }
  }

  userAction (netID, action, model, data) {
    try {
      this.logger.verbose(`${netID}: ${action} for ${model}:\n${JSON.stringify(data)}`)
    } catch (err) {
      console.error('LOGS:', err)
    }
  }
}
//  https://k94n.com/es6-modules-single-instance-pattern
let Log = new Logger()
export default Log
