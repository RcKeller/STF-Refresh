
/*
ENVIRONMENT CONFIG FOR CLIENT
The client side is walled off from the filesystem,
meaning it cannot parse files with 'config'. As a solution,
this JS file will provide the requisite config data.
This is actually a good thing, thus config can't be hijacked for
API keys and security files.
*/
const ENV = process.env.NODE_ENV
// const DEV: process.env.NODE_ENV === 'development',
// const PROD: process.env.NODE_ENV === 'production',
const API = (process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://demo-reactgo.herokuapp.com'
)

console.log('--------------------------')
console.log(`===>  Initialized ${ENV} web client`)
console.log(`===>  Speaking with ${API}`)
console.log('--------------------------')

export { ENV, API }
// export { ENV, API }
