import { apiEndpoint } from '../../config/app';
import createRestApiClient from '../utils/createRestApiClient';
// import config from 'config'
// const baseURL = config.get('api')

export default () => {
  const client = createRestApiClient().withConfig({ baseURL: apiEndpoint });
  return {
    login: ({ email, password }) => client.request({
      method: 'POST',
      url: '/sessions',
      data: {
        email,
        password
      }
    }),
    signUp: ({ email, password }) => client.request({
      method: 'POST',
      url: '/users',
      data: {
        email,
        password
      }
    }),
    logOut: () => client.request({
      method: 'DELETE',
      url: '/sessions'
    })
  };
};
