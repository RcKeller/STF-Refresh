import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { fetchVoteData } from './fetch-data';
import {
  Template, FrontPage,
  FAQ, About, Contact
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
    <Route path="/" component={Template} >
      <IndexRoute component={FrontPage} />
      <Route path="/faq" component={FAQ}/>
      <Route path="/about" component={About}/>
      <Route path="/contact" component={Contact}/>
      {/* <IndexRoute component={Vote} fetchData={fetchVoteData} />
      <Route path="login" component={LoginOrRegister} onEnter={redirectAuth} />
      <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
      <Route path="about" component={About} /> */}
    </Route>
  );
};
