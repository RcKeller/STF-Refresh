import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Template from './views/Template/Template'
/*
CODE SPLITTING:
This weird hackery is the most clean way to split components into different JS
files that are loaded async. Router does not officially support this.
Please note, migration to v4 is a BREAKING change.
https://github.com/reactGo/reactGo/pull/841/files
*/
const SplitFrontPage = (l, c) => require.ensure([], () => c(null, require('./views/FrontPage/FrontPage').default))
// const SplitNotFound = (l, c) => require.ensure([], () => c(null, require('./views/NotFound/NotFound').default))
const SplitFAQ = (l, c) => require.ensure([], () => c(null, require('./views/FAQ/FAQ').default))
const SplitAbout = (l, c) => require.ensure([], () => c(null, require('./views/About/About').default))
const SplitContact = (l, c) => require.ensure([], () => c(null, require('./views/Contact/Contact').default))
const SplitCreate = (l, c) => require.ensure([], () => c(null, require('./views/Proposals/Create/Create').default))
const SplitEdit = (l, c) => require.ensure([], () => c(null, require('./views/Proposals/Edit/Edit').default))
const SplitProposals = (l, c) => require.ensure([], () => c(null, require('./views/Proposals/Proposals').default))
const SplitProposal = (l, c) => require.ensure([], () => c(null, require('./views/Proposals/Proposal/Proposal').default))
const SplitBlocks = (l, c) => require.ensure([], () => c(null, require('./views/Blocks/Blocks').default))
const SplitBlock = (l, c) => require.ensure([], () => c(null, require('./views/Blocks/Block/Block').default))
const SplitKnowledge = (l, c) => require.ensure([], () => c(null, require('./views/Committee/Knowledge/Knowledge').default))
const SplitArticle = (l, c) => require.ensure([], () => c(null, require('./views/Committee/Knowledge/Article/Article').default))
const SplitDashboard = (l, c) => require.ensure([], () => c(null, require('./views/Committee/Dashboard/Dashboard').default))
const SplitVoting = (l, c) => require.ensure([], () => c(null, require('./views/Committee/Voting/Voting').default))
const SplitDocket = (l, c) => require.ensure([], () => c(null, require('./views/Committee/Docket/Docket').default))
const SplitConfig = (l, c) => require.ensure([], () => c(null, require('./views/Committee/Config/Config').default))

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { user: { authenticated } } = store.getState()
    if (!authenticated) {
      try {
        window.location = '/auth/google'
      } catch (err) {
        console.error(err)
      }
      replace({
        //  TODO: When shib is fully implemented, dynamically re-route based on ENV
        // pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
    callback()
  }
  //  TODO: Refactor once we have a live demo
  const requireSTF = (nextState, replace, callback) => {
    const { user: { stf } } = store.getState()
    if (!stf) {
      try {
        window.location = '/auth/google'
      } catch (err) {
        console.error(err)
      }
      replace({
        //  TODO: When shib is fully implemented, dynamically re-route based on ENV
        // pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
    callback()
  }

  return (
    <Route path='/' breadcrumbName='Home' component={Template} >
      <IndexRoute getComponent={SplitFrontPage} />
      {/* <Route path='*' breadcrumbName='404 - Page Not Found' getComponent={SplitNotFound} /> */}

      <Route path='/faq' breadcrumbName='F.A.Q.' getComponent={SplitFAQ} />
      <Route path='/about' breadcrumbName='About' getComponent={SplitAbout} />
      <Route path='/contact' breadcrumbName='Contact Us' getComponent={SplitContact} />

      <Route path='/proposals' breadcrumbName='Proposals' getComponent={SplitProposals} />
      <Route path='/proposals/:year/:number' breadcrumbName='View Proposal' getComponent={SplitProposal} />
      <Route path='/blocks' breadcrumbName='Blocks' getComponent={SplitBlocks} />
      <Route path='/blocks/:number'
        breadcrumbName='Block' getComponent={SplitBlock}
      />

      <Route path='/create'
        onEnter={requireAuth}
        breadcrumbName='Create Proposal' getComponent={SplitCreate}
      />
      <Route path='/edit/:id'
        onEnter={requireAuth}
        breadcrumbName='Edit Proposal' getComponent={SplitEdit}
      />

      <Route path='/knowledge'
        onEnter={requireSTF}
        breadcrumbName='Knowledge Base' getComponent={SplitKnowledge}
      />
      <Route path='/knowledge/:number'
        onEnter={requireSTF}
        breadcrumbName='Knowledge Base Article' getComponent={SplitArticle}
      />
      <Route path='/dashboard'
        onEnter={requireSTF}
        breadcrumbName='Dashboard' getComponent={SplitDashboard}
      />
      <Route path='/voting'
        onEnter={requireSTF}
        breadcrumbName='Voting' getComponent={SplitVoting}
      />
      <Route path='/docket'
        onEnter={requireSTF}
        breadcrumbName='Set Docket' getComponent={SplitDocket}
      />
      <Route path='/config'
        onEnter={requireSTF}
        breadcrumbName='Site Config' getComponent={SplitConfig}
      />
    </Route>
  )
}
