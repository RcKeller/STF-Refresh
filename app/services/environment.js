/*
ENVIRONMENT CONFIG FOR CLIENT
The client side is walled off from the filesystem,
meaning it cannot parse files with 'config'. As a solution,
this JS file will provide the requisite config data.
This is actually a good thing, thus config can't be hijacked for
API keys and security files.
*/
const ENV = process.env.NODE_ENV
const API = (process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://uwstf.org'
)
const version = process.env.VERSION || 'v2'

export { ENV, API, version }
export default { ENV, API, version }
