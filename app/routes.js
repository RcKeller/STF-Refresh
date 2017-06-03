import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {
  //  Core components
  Template, FrontPage,
  //  Static Pages
  FAQ, About, Contact,
  //  Dynamic pages
  Browse, Create, Documents
} from './views'
/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default (store) => {
 const requireAuth = (nextState, replace, callback) => {
   const { user: { authenticated }} = store.getState();
   if (!authenticated) {
     replace({
       pathname: '/login',
       state: { nextPathname: nextState.location.pathname }
     });
   }
   callback();
 };

 const redirectAuth = (nextState, replace, callback) => {
   const { user: { authenticated }} = store.getState();
   if (authenticated) {
     replace({
       pathname: '/'
     });
   }
   callback();
 };
  return (
    <Route path="/" breadcrumbName="Home" component={Template} >
      <IndexRoute component={FrontPage} />

      <Route path="/faq" breadcrumbName="F.A.Q." component={FAQ}/>
      <Route path="/about" breadcrumbName="About" component={About}/>
      <Route path="/contact" breadcrumbName="Contact Us" component={Contact}/>
      <Route path="/proposals" breadcrumbName="Browse Proposals" component={Browse}>
        <Route path="/create" breadcrumbName="Create Proposal" component={Create}/>
      </Route>
      <Route path="/documents" breadcrumbName="Documents" component={Documents}/>
    </Route>
  );
};

/*
Example routes w/ Auth:

<IndexRoute component={Vote} fetchData={fetchVoteData} />
<Route path="login" component={LoginOrRegister} onEnter={redirectAuth} />
<Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
<Route path="about" component={About} />
*/
