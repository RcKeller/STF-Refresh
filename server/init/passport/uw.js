// import db from '../../db'
// import config from 'config'
// const fs = require('fs')
// import path from 'path'
//  Passport-UWShib is using commonJS, so don't try adding ES6 trickery here.
// var Shibboleth = require('passport-uwshib')

export default (passport) => {
  // try {
  //   const privCertPath = path.resolve(process.cwd(), 'security', 'server-pvk.pem')
  //   console.warn('DEV: Using priv cert path', privCertPath)
  //   const privateKey = fs.readFileSync(privCertPath, 'utf-8')
  //   //  Shib wants a domain formatted like "uwstf.org:8090"
  //   const domain = `${config.get('domain')}:${config.get('port')}`
  //   //  Shib wants an entityID with the protocol like "https://uwstf.org:8090"
  //   const entityId = `${config.get('protocol')}://${domain}`
  //   const callbackURL = config.get('uw.callbackURL')
  //   console.warn('SHIB: Connecting as', entityId)
  //   console.warn('Callback route:', callbackURL)
  //   var UWStrategy = new Shibboleth.Strategy({
  //     entityId,
  //     privateKey,
  //     callbackURL,
  //     domain
  //   })
  //   passport.use(UWStrategy)
  //   console.log(`Connected to UW Shibboleth as ${entityId}`)
  // } catch (err) {
  //   console.warn(`ERROR: UW Shib strategy failed to initialize. Auth WILL be broken.\n${err}`)
  // }
}
