// import db from '../../db'
import config from 'config'

export default (passport) => {
  try {
    const domain = `${config.get('domain')}:${config.get('port')}`
    const url = `${config.get('protocol')}://${domain}`
    //  Passport-UWShib is using commonJS, so don't try adding ES6 trickery here.
    var Shibboleth = require('passport-uwshib')
    var UWStrategy = new Shibboleth.Strategy({
      entityId: url,
      privateKey: config.get('key'),
      callbackURL: config.get('uw.callbackURL'),
      domain
    })
    passport.use(UWStrategy)
    console.log(`Connected to UW Shibboleth as ${url}`)
  } catch (err) {
    console.warn(`ERROR: UW Shib strategy failed to initialize. Auth WILL be broken.\n${err}`)
  }
}
