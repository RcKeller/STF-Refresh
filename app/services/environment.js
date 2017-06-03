
/*
ENVIRONMENT CONFIG FOR CLIENT
The client side is walled off from the filesystem,
meaning it cannot parse files with 'config'. As a solution,
this JS file will provide the requisite config data.
This is actually a good thing, thus config can't be hijacked for
API keys and security files.
*/
const env = {
  env: process.env.NODE_ENV,
  dev: process.env.NODE_ENV === 'development',
  prod: process.env.NODE_ENV === 'production',
  api: (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://demo-reactgo.herokuapp.com'
  )
}
console.log('--------------------------')
console.log(`===>  Initialized ${env.env} web client`)
console.log(`===>  Speaking with ${env.api}`)
console.log('--------------------------')

export default env
