# UW STF Web Refresh

<img src="https://uwstf.org/img/logoname.png" alt="University of Washington Student Tech Fee" align="center" />

![title](https://travis-ci.org/rykeller/STF-Refresh.svg?branch=v1.0.0)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
- [Original Repo](https://github.com/BBKolton/STF)
- [Based on reactGo](https://github.com/reactGo/reactGo/) (adapted and optimized)

This is a full refresh of the technology behind uwstf.org. Built using modern best practices, automated testing and the intent of being run as a containerized, isolated process, this introduces a code base built-to-last and should put an end to churn in technologies and databases.


# Refresh Roadmap

**Proof-of-Concept** (Presented 5/12)
- [x] Scaffold the new server
  - [x] Test stability
- [x] Develop test suites, build tools and generators
  - [x] Inject Devtools for development environments
  - Inherited most from [reactGo](https://github.com/reactGo/reactGo/)
- [x] Enable routing with code splitting (load what you need)
  - [-] Add Tree Shaking - failed (Webpack issues, too unstable)
- [x] Scaffold the initial view, state management and data flow
- [x] Incorporate UI Kit
  - [x] Theme the UI library for UW branding
  - Chose Ant Design due to company backing / maintenance, typescript codebase for intellisense, and compatibility with branding.
- [x] Complete basic static views

**Architecture**
- [x] Create configuration system (using `config`)
- [x] Incorporate simple React implementation
  - Reject poor modern practices that have negligible benefits, increase code complexity, etc (e.g. JSS, styled-components, redux-saga).
    - Really, the above are senseless and just increase spaghetti in the code base. I'm not an Italian chef. 2 years from now, I have to hand off this project to someone that actually knows the web, not a developer obsessed with decoupling everything and a case of `dispatch(crazy)`.
- [x] Factor out configuration information and environment variables
  - [x] Add sensible defaults.
- [x] Refactor MVC into MVC with Redux "Services"
  - Services are a client-side mapping of controllers to redux store
- [x] Refactor & abstract out Flux Architecture / Redux implementation
  - Too complex to be coupled with server/render logic, and is set-and-forget.
  - Server has been entirely refactored too.
- [x] Internal docs on code splitting and isomorphism

**RESTful API**
- [x] Incorporate DB
  - [x] Decide on DB (MongoDB)
  - [x] Develop new schema
  - [x] Create models
- [x] Develop authentication strategies
  - [] Production: Use passport-uwshib for secure UW NetID SAML authentication
      - [x] Create placeholder functions/config
  - [x] Development: Use passport-google-oauth for "Psuedo-Auth" in development, create fake netid users. For testing.
  - [x] Create authorization middlewares for CRUD operations
- [x] Create core RESTful routes for standard CRUD
- [x] Create test-data generator for populating lorem-ipsum on spinup.
- [x] Create client-side services for connecting the API to redux store.
  - [x] Incorporate features for efficient AJAX
    - [x] Find a query-caching solution
    - [x] Cancel in-flight requests on component unmount
  - [x] Services for Authentication
  - [x] Services for Core REST routes
  - [] Custom services

**Core Features**
(Deadline: Before Aug 2017)
- [x] Static Pages
  - [x] About Us
  - [x] Contact
  - [x] FAQ
- [x] Auth System
  - [x] Incorporate secured client-side routing (auth only routes)
- [] Proposal Pages
  - [] Create proposals
  - [] Browse Proposals
    - [] Proposal View
      - [] Comment on Proposal
      - [] Amend a Proposal (supplemental)
      - [] Delete proposal
  - [] Proposal reports
    - [] Proposal audits
  - [] Block Funding
- [] Voting Pages
  - [] Docket Page for meetings (proposal summaries w/o full case)
    - [] Review Proposals
      - [] Create partials (should it be here?)
  - [] View Similar Proposals (same dept, author, items...)
- [] Admin Pages (semi-optional)
  - [] Open/close proposal cycles
  - [] Change AuthZ
  - [] Add announcements to frontpage
  - [] Edit committee info / static content
- [] Document Archive
  - Under a crunch, implement dropbox/google docs. Self-hosting causes problems.

**Demo Deployment**
(Deadline: Before Sept 2017)
- [] Migrate ALL legacy data to new DB.
- [] Complete coverage with testing (Enzyme)
- [] Explore continuous integration options in backlog

### Backlogged tasks
Optional or non-sequential elements of the project.

**Orchestration / Continuous Integration**
- Not enough time to add all tests right now, need to get MVP up faster, it's moreso for the next dev.
- [] Isolate environments
  - [x] Include config manager or package for env variables
  - [] Containerize Node App (Docker)
    - [x] Optimize container build time
  - [x] Containerize standalone datastore
    - Is a docker volume, not sure what prod usage will look like going forward though.
  - [] Create linked, networked containers with Docker-Compose
    - [] Use V3 syntax (future proofing)
- [] Incorporate with a cloud provider
  - [] AWS if possible (because public institution budgets).

**Enhancement**
- [] Bring static page content to the DB under a "content" schema
  - [] Query this when `Template.js` loads.

**Future Features**
- [] Add financial admin tools / quality of life features for the committee
- [] Create an asset-tracking webapp for in-depth tracking of funding from proposal to device

### Stretch Goals
These are unrelated to the task at hand and will be handled on non-billable time.

- [] Develop an unopinionated UW component library
- [] Create a shib-enabled MERN stack boilerplate for UW webapps
- [] Consider making route GET requests open to the public

# Technical Overview

#### Built for Continuity
We don't want a scenario where there's patchwork, legacy databases being joined on every query, or we get trapped in a version lock. This is built using technologies and design patterns that have significant traction so that this site is built-to-last:
- [ES6 Javascript](http://stateofjs.com/2016/flavors/) (the 2015 flavor of js) is being used as well as ES7 (future features)
- Webpack is used for [bundling](http://stateofjs.com/2016/buildtools/), pretty standard. Basically, it compresses our files, runs fancy local servers, and translates new code into old code IE can run. We use some plugins
- Node and Express are our server and API - they are established and allow us to reuse auth code from UW repositories.
- React.js is our [front-end framework](http://stateofjs.com/2016/frontend/) (and is used by the server to push auth/metadata).
  - It is very similar to Vue.js, but is more stable, documented, and introduces more possibilities. UW has courses in this too. Vue is really cool and simpler, but is also only maintained by a lone guy in China and has a more international presence.
- Redux is used for [state management](http://stateofjs.com/2016/statemanagement/) and is a gold standard. You can use it to log every state change and function call.
- CSS Modules are being used for [style](http://stateofjs.com/2016/css/). It's just standard CSS, but it's scoped per-component, so I can declare the same class names in different pages and not have conflicts. It's great and there's no buy-in or preprocessing.
- MongoDB is our database. It is JSON based, easy to scale, and congruent with the kind of candidates UW produces (big data emphasis).
- I remain unopinionated about DB's right now, but currently I've got MongoDB in place.
- Enzyme is used for [testing](http://stateofjs.com/2016/testing/). Backed by AirBNB and most of the react community, it's a solid choice.

There are links to the "State of JavaScript", a study from a few months ago on the web development world. Regarding [features](http://stateofjs.com/2016/features/), we have the following:
- Server Side Rendering
- Code Splitting (Universal React)
- Optimistic Updates (React)
- Hot Reloading (Webpack)
- Time Travel Debugging (Redux Devtools)

I've got a manifest of all technologies in use (equivocal to `wtf.txt`) in STACK.md. It has the real "technical" operational notes. Your `package.json` has a less readable manifest, and `yarn.lock` is a running log of all updates and changes for finding which changes are breaking.

---

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
