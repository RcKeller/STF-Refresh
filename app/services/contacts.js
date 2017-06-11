import { API, version } from './environment'

//  Get all contacts
const contacts = () => ({
  url: `${API}/${version}/contacts`,
  options: { method: 'GET' },
  update: {}  //  No args
})
export default { contacts }
