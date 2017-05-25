import fetch from 'isomorphic-fetch'
import Config from '../../server/config'

// Simple util for a REST call.
export default function callApi (endpoint, method = 'get', body) {
  return fetch(`${Config.api}/${endpoint}`, {
    headers: { 'content-type': 'application/json' },
    method,
    body: JSON.stringify(body)
  })
  .then(response => response.json().then(json => ({ json, response })))
  .then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json)
    }
    return json
  })
  .then(
    response => response,
    error => error
  )
}
