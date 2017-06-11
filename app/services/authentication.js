import { API } from './environment'

const logout = () => ({
  url: `${API}/sessions`,
  options: { method: 'DELETE' },
  update: {}  //  none
})
export default { logout }
