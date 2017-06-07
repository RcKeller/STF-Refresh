// import createRestApiClient from '../utils/createRestApiClient'
import env from './environment'
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

const logout = ({ email, password }) => ({
  url: `${env.api}/sessions`,
  method: 'DELETE',
  body: { email, password }
});
export default { logout }
