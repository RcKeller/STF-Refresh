import React from 'react'
import { Route, IndexRoute } from 'react-router'
import {
  //  Core components
  Template, FrontPage,
  //  Static Pages
  FAQ, About, Contact,
  //  Dynamic pages
  Create, Agreement,
  Proposals, Proposal,
  Blocks, Block,
  Documents,
  Calendar, Events
} from './views'
/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState()
    if (!authenticated) {
      window.location = '/auth/google'
      replace({
        //  TODO: When shib is fully implemented, dynamically re-route based on ENV
        // pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
    callback()
  }

  const redirectAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState()
    if (authenticated) {
      replace({
        pathname: '/'
      })
    }
    callback()
  }
  return (
    <Route path='/' breadcrumbName='Home' component={Template} >
      <IndexRoute component={FrontPage} />

      <Route path='/faq' breadcrumbName='F.A.Q.' component={FAQ} />
      <Route path='/about' breadcrumbName='About' component={About} />
      <Route path='/contact' breadcrumbName='Contact Us' component={Contact} />

      <Route path='/proposals' breadcrumbName='Proposals' component={Proposals} />
      <Route path='/proposals/:year/:number' breadcrumbName='View Proposal' component={Proposal} />
      <Route path='/blocks' breadcrumbName='Blocks' component={Blocks} />
      <Route path='/blocks/:number'
        breadcrumbName='Block' component={Block}
      />

      <Route path='/create'
        onEnter={requireAuth}
        breadcrumbName='Create Proposal' component={Agreement}
      />
      <Route path='/create/:id'
        onEnter={requireAuth}
        breadcrumbName='Proposal Agreement' component={Create}
      />
      <Route path='/amend'
        // onEnter={requireAuth}
        breadcrumbName='Proposal Agreement' component={<div>Amend</div>}
      />
      <Route path='/amend/:id'
        // onEnter={requireAuth}
        breadcrumbName='Proposal Agreement' component={<div>Amend an ID</div>}
      />

      <Route path='/documents' breadcrumbName='Documents' component={Documents} />

      <Route path='/calendar' breadcrumbName='Calendar' component={Calendar} />
      <Route path='/calendar/events' breadcrumbName='Events' component={Events} />

      <Route path='/docket' breadcrumbName='Calendar' component={<div>Weekly meeting docket, with voting for admins.</div>} />
      <Route path='/admin' breadcrumbName='Calendar' component={<div>Admin Panel</div>} />
    </Route>
  )
}
/*
TODO:
/docket/:id
/documents
/calendar
/calendar/events
/
*/
/*
Example routes w/ Auth:

<IndexRoute component={Vote} fetchData={fetchVoteData} />
<Route path="login" component={LoginOrRegister} onEnter={redirectAuth} />
<Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
<Route path="about" component={About} />
*/
