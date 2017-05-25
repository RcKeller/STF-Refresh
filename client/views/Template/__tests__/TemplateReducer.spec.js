import test from 'ava'
import { reducerTest } from 'redux-ava'
import appReducer, { getShowAddPost } from '../TemplateReducer'
import { toggleAddPost } from '../TemplateActions'

test('action for TOGGLE_ADD_POST is working', reducerTest(
  appReducer,
  { showAddPost: false },
  toggleAddPost(),
  { showAddPost: true },
))

test('getShowAddPost selector', t => {
  t.is(getShowAddPost({
    app: { showAddPost: false }
  }), false)
})
