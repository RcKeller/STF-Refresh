# Stack Overview

#### Stack Includes:
- [Node](https://nodejs.org/en/) - The gold standard server of 2017 (besides golang)
  - [Express](https://expressjs.com/) - RESTful API and authentication endpoints
- [React](https://facebook.github.io/react/) - Universal / Isomorphic rendering
  - Server delivers document head, auth state and raw CSS.
  - Client loads context-sensitive CSS and routes as necessary.
  - This is an SPA (Single Page Application) at heart - Resources are heavily compressed, sent to the client, and unpacked as necessary - making the entire experience seamless, snappy, and easy to manage state-wise. Unlike most SPA's though, data is lazy loaded so it's not all frontloaded.
    - See `views/index.js` for details - we use `require(callback)` to make code split.
- [Redux](https://github.com/reactjs/redux) - State management that abstracts out all state/behavior into single, self-contained and immutable entities.
  - [Redux-Thunk](https://github.com/gaearon/redux-thunk) for async actions. It's lightweight and no-nonsense, just use functions like normal. This is for continuity for development practices (and sagas are opinionated and dispatch heavy)
  - [Redux-Query](https://amplitude.github.io/redux-query/#/) - query DB as necessary components load, cache response, cancel in-flight requests if users leave
- [Redux DevTools](https://github.com/gaearon/redux-devtools) - Time-travel debugging, all state and behavior logged.
- [MongoDB](https://www.mongodb.com/) for a NOSql database (Issue raised for debate over this choice)
  - [Mongoose](https://github.com/Automattic/mongoose) - DB object modeling and queries. Use `populate(<model>)` like a join
- [Passport-Google-OAuth](https://github.com/jaredhanson/passport-google-oauth) - For "Psuedo-Auth" in non-production environments (normally not possible at UW)
- [Passport-SAML](https://github.com/bergie/passport-saml) Authentication tool using SAML 2.0
  - [uwshib](https://github.com/drstearns/passport-uwshib) - Strategy for Shibboleth auth (UW's system)
  - These are both essentially required for auth and the only [documented solutions](https://github.com/drstearns/passport-uwshib/blob/master/example/server.js) for UW.

#### Build process includes:
- [Webpack](https://webpack.github.io) - Bundler
- [Babel](https://babeljs.io/) - Transpiling ES6/ES7 future features to ES5 compatible and browser prefixed code
  - [Babel-Plugin-Import](https://github.com/ant-design/babel-plugin-import/) - Imports components instead of full features for packages.
- [Enzyme](https://github.com/airbnb/enzyme) - Testing framework

#### UI includes:
- [Ant Design](https://ant.design/docs/react/introduce) - UI Library. Robust API's, docs, and backed by Alibaba
  - [LESS](http://lesscss.org/) - Theming of Ant Design. Slated for removal (eventually) as I work on an adapted/bespoke UW component library.
- [CSS Modules](https://github.com/css-modules/css-modules) - Modular Per-component Stylesheets
