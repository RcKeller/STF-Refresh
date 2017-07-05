import Users from './users'
import Blocks from './blocks'
/*
This API automatically generates its own REST routes, sans controllers
See the implementation at routes.js
*/
const controllers = {
  //  Auth and User data
  Users,
  Blocks
}
export default controllers
