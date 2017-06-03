/*
Example code from prior repo
Fetches posts n' such.
*/

/*
import createRestApiClient from '../utils/createRestApiClient';
import env from '../environment'

export default () => {
  const client = createRestApiClient().withConfig({ baseURL: env.api });
  return {
    getTopics: () => client.request({
      method: 'GET',
      url: '/topic'
    }),
    deleteTopic: ({ id }) => client.request({
      method: 'DELETE',
      url: `/topic/${id}`
    }),
    updateTopic: ({ id, data }) => client.request({
      method: 'PUT',
      url: `/topic/${id}`,
      data
    }),
    createTopic: ({ id, data }) => client.request({
      method: 'POST',
      url: `/topic/${id}`,
      data
    })
  };
};
*/
