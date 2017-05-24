import test from 'ava'
import callApi from '../apiCaller'
import Config from '../../../server/config'
import nock from 'nock'

test('method defaults to GET', t => {
  const reply = { foo: 'bar' }
  nock(Config.api)
    .get('/foo')
    .reply(200, reply)
  return callApi('foo').then(response => {
    t.deepEqual(response, reply)
  })
})

test('sends the body', t => {
  const body = { id: 5 }
  const reply = { foo: 'bar' }
  nock(Config.api)
    .post('/foo', body)
    .reply(200, reply)
  return callApi('foo', 'post', body).then(response => {
    t.deepEqual(response, reply)
  })
})

test('returns the error', t => {
  const reply = { message: 'Errrrrrrrrr' }
  nock(Config.api)
    .get('/send_error')
    .reply(500, reply)
  return callApi('send_error').then(error => {
    t.deepEqual(error, reply)
  })
})
