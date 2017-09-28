import config from 'config'
import winston from 'winston'
//  http://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/
//  http://tostring.it/2014/06/23/advanced-logging-with-nodejs/

class Logger {
  constructor () {
    console.warn('LOGS: Initializing Logger ("Winston")')
    //  Initialize Logging functions
    this.logger = new winston.Logger({
      transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
          timestamp: this.time,
          colorize: true,
          level: 'debug'
        })
      ]
    })
    this.logger.level = 'debug'
    this.logger.info('Hello world')
    this.logger.debug('Debugging info')
  }

  timeWithoutDate () {
    return new Date().toLocaleTimeString()
  }

  timeWithDate () {
    const date = new Date()
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  log (message, encoding) {
    this.info(message)
  }
  error (message, encoding) {
    this.logger.error(message)
  }
  warn (message, encoding) {
    this.logger.warn(message)
  }
  info (message, encoding) {
    this.logger.info(message)
  }
  verbose (message, encoding) {
    this.logger.verbose(message)
  }
  debug (message, encoding) {
    this.logger.debug(message)
  }
  silly (message, encoding) {
    this.logger.silly(message)
  }

  userAction (netID, action, model, data) {
    this.logger.verbose(`${netID}: ${action} for ${model}:\n${data}`)
  }

}
//  https://k94n.com/es6-modules-single-instance-pattern
// let Slack = new Bot('<bot-api-key>', 'Calcifer')
let Logging = new Logger()
export default Logging
