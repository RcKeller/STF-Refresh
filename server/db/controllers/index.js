import users from './users'
import blocks from './blocks'
/*
This API automatically generates its own REST routes, sans controllers
See the implementation at routes.js
*/
export default {
  //  Auth and User data
  users,
  blocks
}
console.log('Controllers exported?')
