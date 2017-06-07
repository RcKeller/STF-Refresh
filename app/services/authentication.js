// import createRestApiClient from '../utils/createRestApiClient'
import { API } from './environment'
//
// export default () => {
//   const client = createRestApiClient().withConfig({ baseURL: env.api })
//   return {
//     login: ({ email, password }) => client.request({
//       method: 'POST',
//       url: '/sessions',
//       data: {
//         email,
//         password
//       }
//     }),
//     signUp: ({ email, password }) => client.request({
//       method: 'POST',
//       url: '/users',
//       data: {
//         email,
//         password
//       }
//     }),
//     logOut: () => client.request({
//       method: 'DELETE',
//       url: '/sessions'
//     })
//   }
// }
//

console.log(API)

const logout = () => ({
  url: `${API}/sessions`,
  options: { method: 'DELETE' },
  update: {}  //  none
});
export default { logout }
