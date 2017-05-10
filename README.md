# UW Student Tech Fee Committee
## Project MERN

![title](https://travis-ci.org/rykeller/STF-MERN.svg?branch=v1.0.0)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

MERN is an entirely new version of https://uwstf.org as an isomorphic app using Mongo, Express, React and NodeJS. Built using modern best practices, automated testing and the intent of being run as a containerized, isolated process, this is meant to put an end to the churn in developers, technologies and databases and introduce a code base built-to-last.

- [Website](https://uwstf.org/)
- [Original Repo](https://github.com/BBKolton/STF)

Scaffolding based off of [mern-starter and mern-cli](http://mern.io/).

## Quickstart - Metal

```
  # Bash script to configure your env
  source dev.env
  # package.json runs all necessary node builds
  npm install
  npm start
```

### Docker Composition
```
# Dev Environment
source docker-dev.env
# Production
source docker-prod.env
```

**An active MongoDB session on 27017:27017 (default) is required.** Additionally, `npm3` may be a soft dependancy, but I've upgraded the current version to run off the `-proxy` option with no issues.

## Available Commands

1. `npm run start` - starts the development server with hot reloading enabled

2. `npm run bs` - bundles the code and starts the production server

3. `npm run test` - start the test runner

4. `npm run watch:test` - start the test runner with watch mode

5. `npm run cover` - generates test coverage report

6. `npm run lint` - runs linter to check for lint errors

## Technical stack

##### **MERN**
MongoDB, Express, React and Node.js

#### Application Includes:
- [x] [React](https://facebook.github.io/react/) - Universal / Isomorphic rendering
  - Server delivers metadata, auth state and raw CSS.
  - Client loads context-sensitive CSS and routes as necessary.
  - STF-MERN is an SPA (Single Page Application) at heart - Resources are heavily compressed, sent to the client, and unpacked as necessary - making the entire experience seamless, snappy, and easy to manage state-wise.
- [x] [Redux](https://github.com/reactjs/redux) - State management that abstracts out all state/behavior into single, self-contained and immutable entities.
- [x] [Redux-auth-wrapper](https://github.com/mjrussell/redux-auth-wrapper)
- [x] [Redux DevTools](https://github.com/gaearon/redux-devtools) - Time-travel debugging, all state and behavior logged.
- [x] [MongoDB](https://www.mongodb.com/) for a NOSql database
  - [x] [Mongoose](https://github.com/Automattic/mongoose) - DB object modeling
- [x] [Passport-SAML](https://github.com/bergie/passport-saml) Authentication tool using SAML 2.0
  - [x] [uwshib](https://github.com/drstearns/passport-uwshib) - Strategy for Shibboleth auth (UW's system)
- [x] [Node](https://nodejs.org/en/) - The gold standard server of 2017 (besides golang)

#### Build process includes:
- [x] [Webpack](https://webpack.github.io) - Bundler
- [x] [Babel](https://babeljs.io/) - Transpiling ES6/ES7 future features to ES5 compatible and browser prefixed code
- [x] [CSS Modules](https://github.com/css-modules/css-modules) - Modular Per-component Stylesheets
- [x] [AVA](https://webpack.github.io) - Test suite, runs pre-commit


## File Structure

### Webpack Configs

MERN uses Webpack for bundling modules. There are four types of Webpack configs provided `webpack.config.dev.js` (for development), `webpack.config.prod.js` (for production), `webpack.config.server.js` (for bundling server in production) and `webpack.config.babel.js` (for [babel-plugin-webpack-loaders](https://github.com/istarkov/babel-plugin-webpack-loaders) for server rendering of assets included through webpack).

The Webpack configuration is minimal and beginner-friendly. You can customise and add more features to it for production build.

### Server

MERN uses express web framework. Our app sits in server.js where we check for NODE_ENV.

If NODE_ENV is development, we apply Webpack middlewares for bundling and Hot Module Replacement.

#### Server Side Rendering

We use React Router's match function for handling all page requests so that browser history works.

All the routes are defined in `client/routes.js`. React Router renders components according to route requested.

```js
// Server Side Rendering based on routes matched by React-router.
app.use((req, res) => {
    match({
        routes,
        location: req.url
    }, (err, redirectLocation, renderProps) => {
        if (err) {
            return res.status(500).end('Internal server error');
        }

        if (!renderProps) {
            return res.status(404).end('Not found!');
        }

        const initialState = {
            posts: [],
            post: {}
        };

        const store = configureStore(initialState);

        fetchComponentData(store.dispatch, renderProps.components, renderProps.params).then(() => {
            const initialView = renderToString(
                <Provider store = {store} >
                  <RouterContext {...renderProps}/>
                </Provider>
            );

            const finalState = store.getState();

            res.status(200).end(renderFullPage(initialView, finalState));
        }).catch(() => {
            res.end(renderFullPage('Error', {}));
        });
    });
});
```

`match` takes two parameters, first is an object that contains routes, location and history and second is a callback function which is called when routes have been matched to a location.

If there's an error in matching we return 500 status code, if no matches are found we return 404 status code. If a match is found then, we need to create a new Redux Store instance.

**Note:** A new Redux Store has populated afresh on every request.

`fetchComponentData` is the essential function. It takes three params: first is a dispatch function of Redux store, the second is an array of components that should be rendered in current route and third is the route params. `fetchComponentData` collects all the needs (need is an array of actions that are required to be dispatched before rendering the component) of components in the current route. It returns a promise when all the required actions are dispatched. We render the page and send data to the client for client-side rendering in `window.__INITIAL_STATE__`.

### Client

Client directory contains all the shared components, routes, modules.

#### components
This folder contains all the common components which are used throughout the project.

#### index.js
Index.js simply does client side rendering using the data provided from `window.__INITIAL_STATE__`.

#### modules
Modules are the way of organising different domain-specific modules in the project. A typical module contains the following
```
| - Post
  | - __tests__ // all the tests for this module goes here
      | - components // Sub components of this module
          | - Post.spec.js
          | - PostList.spec.js
          | - PostItem.spec.js
          | - PostImage.spec.js
      | - pages
          | - PostPage.spec.js
          | - PostViewPage.spec.js
      | - PostReducer.spec.js
      | - PostActions.spec.js
  | - components // Sub components of this module
      | - Post.js
      | - PostList.js
      | - PostItem.js
      | - PostImage.js
  | - pages // React Router Pages from this module
      | - PostPage
          | - PostPage.js
          | - PostPage.css
      | - PostViewPage
          | - PostViewPage.js
          | - PostViewPage.css
  | - PostReducer.js
  | - PostActions.js
```

## Misc

### Importing Assets
Assets can be kept where you want and can be imported into your js files or css files. Those fill be served by webpack in development mode and copied to the dist folder during production.

### ES6 support
We use babel to transpile code in both server and client with `stage-0` plugin. So, you can use both ES6 and experimental ES7 features.

### Docker
There are docker configurations for both development and production.

To run docker for development,
```
docker-compose -f docker-compose-development.yml build
docker-compose -f docker-compose-development.yml up
```

To run docker for production,
```
docker-compose build
docker-compose up
```

### Modifying MERN-CLI Generators

#### mern.json
It contains a blueprints array. Each object in it is the config for a generator. A blueprint config contains the name, description, usage, and files array. An example blueprint config
```
{
  "name": "dumb-s",
  "description": "Generates a dumb react component in shared components",
  "usage": "dumb-s [component-name]",
  "files": [
    {
      "blueprint-path": "config/blueprints/dumb-component.ejs",
      "target-path": "client/components/<%= helpers.capitalize(name) %>.js"
    }
  ]
}
```

A file object contains

1. `blueprint-path` - location of the blueprint file

2. `target-path` - location where the file should be generated

3. `parent-path` - optional parameter, used if you want to generate the file inside an already existing folder in your project.

Also, `target-path` supports [ejs](https://github.com/mde/ejs) and the following variables will be passed while rendering,

1. `name` - `<component-name>` input from user

2. `parent` - in particular special cases where you need to generate files inside an already existing folder, you can obtain this parent variable from the user. A config using that will look like,
    ```
    {
      "name": "dumb-m",
      "description": "Generates a dumb react component in a module directory",
      "usage": "dumb-m <module-name>/<component-name>",
      "files": [
        {
          "blueprint-path": "config/blueprints/dumb-component.ejs",
          "parent-path": "client/modules/<%= helpers.capitalize(parent) %>",
          "target-path": "components/<%= helpers.capitalize(name) %>/<%= helpers.capitalize(name) %>.js"
        }
      ]
    }
    ```
    Here, notice the usage. In `<module-name>/<component-name>`, `<module-name>` will be passed as `parent` and `<component-name>` will be passed as `<name>`.

3. `helpers` - an helper object is passed which include common utility functions. For now, it contains `capitalize`. If you want to add more, send a PR to [mern-cli](https://github.com/Hashnode/mern-cli).

#### Blueprint files
Blueprints are basically [ejs](https://github.com/mde/ejs) templates which are rendered with the same three variables(`name`, optional `parent` and `helpers` object) as above.

### Caveats

#### FOUC (Flash of Unstyled Content)
To make the hot reloading of CSS work, we are not extracting CSS in development. Ideally, during server rendering, we will be extracting CSS, and we will get a .css file, and we can use it in the html template. That's what we are doing in production.

In development, after all scripts get loaded, react loads the CSS as BLOBs. That's why there is a second of FOUC in development.

#### Client and Server Markup Mismatch
This warning is visible only on development and totally harmless. This occurs to hash difference in `react-router`. To solve it, react router docs asks you to use `match` function. If we use `match`, `react-hot-reloader` stops working.

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
