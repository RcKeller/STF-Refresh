import expect from 'expect'
import reducer from '../../services/authentication'

describe('Users reducer', () => {
  //  Server sends initial state
  //  Client only handles logout requests
  const initialState = { authenticated: false }
  const isomorphicAuthState = {
    authenticated: true,
    _id: '59a482b5910c753d50b76951',
    name: 'Name Test',
    netID: 'netIDTEST',
    email: 'TEST@uw.edu'
  }

  it('should load default unauthenticated state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState)
  })

  it('should load auth __INITIAL_STATE__ isomorphically', () => {
    expect(
      reducer(isomorphicAuthState, {})
    ).toEqual(isomorphicAuthState)
  })

  it('should handle REMOVE_USER', () => {
    expect(
      reducer(undefined, {type: 'REMOVE_USER'})
    ).toEqual(initialState)
  })
})
