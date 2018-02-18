![Alt text](app/images/logo.png?raw=true "Title")

# UW STF Web Refresh

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![title](https://travis-ci.org/rykeller/STF-Refresh.svg?branch=v1.0.0)
[![Code Climate](https://codeclimate.com/github/RcKeller/STF-Refresh/badges/gpa.svg)](https://codeclimate.com/github/RcKeller/STF-Refresh)

- [Based on reactGo](https://github.com/reactGo/reactGo/) (adapted and optimized)
- [Original Repo](https://github.com/BBKolton/STF)

This is the new uwstf.org - an IT project management webapp used to allocate $5 million dollars across over 100 campus technology projects annually. Any campus organization can use this to begin their own technology projects and seek student endorsement. The STF Committee can use this web platform to review proposals, administer decisions, disperse awards and audit department finances.

The refresh project was an initiative to aggressively modernize the committee and build quality into committee processes. The *traditional proposal* process has been redefined as a *project plan* format, encouraging authors to present their information as a "change" to the academic environment. In regards to engineering, we've modernized our stack as much as possible by incorporating best-practices and thinking about the future in our engineering efforts. For more information, read the [business case](http://rykeller.com/stf-refresh).


## Technology overview

**Summary:** Single Page Application w/ Server-Side Rendered React/Redux. Based on Ant Design by AliBaba, styled with CSS modules and LESS. Served by a Node, Express and MongoDB backend.

- **Language:** [ES6/ES7](https://babeljs.io/learn-es2015/) with [Async / Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) for asynchronous code.
  - By using future specs of JS, we're keeping our stack as current as possible. [State of JS](http://stateofjs.com/2016/flavors/).
- **Testing:** [Enzyme](http://airbnb.io/enzyme/docs/api/) for testing React components
  - Strongly [backed by the community](http://stateofjs.com/2016/testing/), maintained by AirBnB.
- **Build:** [Webpack v3](https://webpack.js.org/concepts/) for module bundling / css processing, as well as [hot module replacement](https://webpack.js.org/concepts/hot-module-replacement/) for dev servers.
  - Fake models are pushed into fresh databases using [Faker](https://github.com/marak/faker.js).


### Front-End
- **Client Framework:** [React](https://reactjs.org/tutorial/tutorial.html)
  - Chosen due to its declarative nature, extensibility, and robust internals / community support. Well supported per [State of JS](http://stateofjs.com/2016/frontend/).
- **UI/UX Language:** [Ant Design](https://ant.design/docs/react/introduce) by AliBaba
  - Chosen for its [brand compliance](http://www.washington.edu/brand/web-2/html-web-components/) and ability to handle / render rich datasets.
- **State Management:** [Redux](https://redux.js.org/), with [Redux-Query](https://amplitude.github.io/redux-query/) for caching and managing network state.
  - [State of JS](http://stateofjs.com/2016/statemanagement/) on state management.


### Back-End
- **Server:** [Node.JS](https://nodejs.org/en/docs/)
  - Chosen for ease of use and development velocity, in addition to working well in our use case (Server Side Rendering).
- **Router:**  [Express](https://expressjs.com/en/starter/basic-routing.html) router implementing [Restify](http://restify.com/docs/home/) APIs
  - Provides a consistent [interface](/server/db/controllers/restify.js) and [query scheme](/app/services/api.js).
- **Authentication:** Dual-Auth strategy implementing Passport for [UW Shibboleth (SAML)](https://www.npmjs.com/package/passport-uwshib) and [Google (OAuth2)](https://www.npmjs.com/package/passport-google-oauth).
  - Generates mock student profiles in development mode using Google user data.
- **Database:** [MongoDB](https://docs.mongodb.com/), using [Mongoose](http://mongoosejs.com/) for ODM and the [autoref](https://www.npmjs.com/package/mongoose-autorefs) / [autopopulate](https://www.npmjs.com/package/mongoose-autopopulate) plugins.
  - Chosen for ease of manipulation and to encourage future developers to manipulate documents outside of the DB, preserving data integrity.



---

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
