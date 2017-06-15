# UW STF Web Refresh

![title](https://travis-ci.org/rykeller/STF-Refresh.svg?branch=v1.0.0)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
- [Original Repo](https://github.com/BBKolton/STF)
- [Based on mern-starter](https://github.com/Hashnode/mern-starter)

This is a full refresh of the technology behind uwstf.org. Built using modern best practices, automated testing and the intent of being run as a containerized, isolated process, this introduces a code base built-to-last and should put an end to churn in technologies and databases.

# Current Site

### Pain Points
A significant amount of technical debt.

- Database needs normalization and currently has two parallel sets of proposal records
- Packages are version-locked
  - All view files have to be updated or replaced due to depreciation of syntax.
- Authentication should be refactored due to performance impact
  - No auth solution for dev environment, crashing any local development.
- State management in express needs to be further documented
  - Unclear entry points, view files expect undocumented data
    - Prior procedure for tracking state was logging to the server console and copy/pasting.
  - Lack of any debugging capability. Break your code, **you get a blank page instead of errors**.
- Styling has many issues
  - Views use a combination of css files and inline styles.
  - Having 12+ global css files is terrible practice, even if there are no current conflicts.
  - Mobile responsiveness is not fully achieved and I'm going through the existing code base and introducing fixes.
- There is no standardized workflow
  - No automated testing or deployment automation process.
    - Current process involves connecting to the production server and introducing changes outside maintenance windows, which breaks financial transactions.

### Feature Requests

- Proposer information / financial data included in browse proposals view.
  - Extremely important for OP&B, Sara & just everyone in general.
- A more robust proposal screening process.
  - More questions framed in the current vs. future state format. What have you tried? What doors did you knock on before coming to the STF?
  - Some fair, yet reasonable questions to weed out personal / research projects masquerading as student use.
- Data Visualization
  - No way in hell we're using D3 with the current stack, but we have a very rich database that goes way back. Going into the future I'd like to develop features and visualizations to convey the impact STF has had on UW.
- Asset tracking
  - Big side project, we haven't gotten too far into the details but this would be a system for tracking assets associated with the STF. Literally tracing student funds down to the very endpoint or service rendered.
- Internal tools incl. site tracker (one of my ideas) - there's an entire lifecycle to a proposal including site visits, and I think the proposal process is only one piece of a bigger picture. STF members should have a robust view that provides information about departments, proposers, workshops, etc.
  - Depending on the need, I think we may also want budgeting tools or some way to track funding closer. Not that there's anything wrong with the human element of maintaining budget sheets.

# Refresh Roadmap

**Proof-of-Concept** (Presented 5/12)
- [x] Scaffold the new server
  - [x] Test stability
- [x] Develop test suites, build tools and generators
  - [x] Inject Devtools for development environments
  - Inherited most from MERN-starter
- [x] Enable routing with code splitting (load what you need)
  - [-] Add Tree Shaking - failed (Webpack issues, too unstable)
- [x] Scaffold the initial view, state management and data flow
- [x] Incorporate UI Kit
  - Chose Ant Design due to company backing / maintenance, typescript codebase for intellisense, and compatibility with branding.
- [x] Complete basic static views

**Architecture**
- [x] Incorporate idiomatic React (component-container structure)
  - Reject poor modern practices that have negligible benefits, increase code complexity, etc (e.g. JSS, styled-components, redux-saga).
    - Really, the above are senseless and just increase spaghetti in the code base. I'm not an Italian chef. 2 years from now, I have to hand off this project to someone that actually knows the web, not a developer obsessed with decoupling everything and a case of `dispatch(crazy)`.
- [x] Factor out configuration information and environment variables
  - [x] Add sensible defaults.
- [x] Refactor MVC into MVVM
  - Technically fake MVVM (model controls are a necessity w/ MERN systems) but logic is coupled.
- [x] Refactor & abstract out Flux Architecture / Redux implementation
  - Too complex to be coupled with server/render logic, and is set-and-forget.
  - Server has been entirely refactored too.
- [x] Internal docs on code splitting and isomorphism

**Orchestration / Continuous Integration**
- [x] Include Automated Testing
  - Not enough time to add all tests right now, need to get MVP up faster, it's moreso for the next dev.
- [x] Containerize Node App (Docker)
  - [x] Optimize container build time
- [x] Containerize standalone datastore
  - Is a docker volume, not sure what prod usage will look like going forward though.
- [x] Create linked, networked containers with Docker-Compose
  - [x] Use V3 syntax (future proofing)
- [-] Incorporate with a cloud provider
  - AWS if possible (because public institution budgets).

**Static-Site Demo**
- Prep a new demo domain/AWS instance
  - Get Shibboleth permissions for this domain
- Test a greenfield deployment w/ a site including simple pages and possible a few CRUD ops

**Authentication & Documentation**
- Complete authentication system with Passport-SAML 2.0 and uwshib
- Complete documentation once stability is established (in case I win the lottery... just kidding. Seriously, I wouldn't do that)
  - Complete full coverage test suites before proceeding to the next few CRUD-intensive milestones

**CRUD operations**
- Migrate ALL legacy data to a new DB schema w/ normalization.
- Create utils for getting/setting data
- Create authorization middlewares for CRUD operations

**Full Incorporation**
(Deadline: Before Au2017)
- Implement proposal creation and browsing
- Implement endorsements and/or proposal linking
- Implement voting and/or metrics
**Future Enhancement**
- Add financial admin tools / quality of life features for the committee
- Create an asset-tracking webapp for in-depth tracking of funding from proposal to device

# Quickstart
There are many environments you may use, depending on if you want to containerize or not. I recommend running local, dev, than production. Local is an included option due to webpack's build complexity and how it takes forever to bundle this.

1. `source local.env` - Local node instance, mongo container (preferred dev environment, fast and light)
2. `npm run start` - starts the development server with hot reloading enabled, no containers
3. `npm run bs` - bundles the code and starts the production server
4. `npm run dockerize-dev` - Dockerizes the app in development mode.
5. `npm run dockerize-prod` - Dockerizes the app for production.
6. `npm run test` - start the test runner
7. `npm run watch:test` - start the test runner with watch mode
8. `npm run cover` - generates test coverage report
9. `npm run lint` - runs linter to check for lint errors

**An active MongoDB session on 27017:27017 (default) is required.** Additionally, `npm3` may be a soft dependency, but I've upgraded the current version to run off the `-proxy` option with no issues.

If using docker machine, please be advised it uses its own assigned IP and intranet, not your localhost:. You can get that ip with `docker-machine ip`.

# Technical Stack

#### Built for Continuity
We don't want a scenario where there's patchwork, legacy databases being joined on every query, or we get trapped in a version lock. This is built using technologies and design patterns that have significant traction so that this site is built-to-last:
- [ES6 Javascript](http://stateofjs.com/2016/flavors/) (the 2015 flavor of js) is being used as well as ES7 (future features)
- React.js is our [front-end framework](http://stateofjs.com/2016/frontend/) (and is used by the server to push auth/metadata).
  - It is very similar to Vue.js, but is more stable, documented, and introduces more possibilities. UW has courses in this too. Vue is really cool and simpler, but is also only maintained by a lone guy in China and has a more international presence.
- Redux is used for [state management](http://stateofjs.com/2016/statemanagement/) and is a gold standard. You can use it to log every state change and function call.
- I remain unopinionated about DB's right now, but currently I've got MongoDB in place.
- Ava is used for [testing](http://stateofjs.com/2016/testing/) and is actually not too popular right now. I actually don't have a problem with it though because I've found testing super easy with this. Here's an [example file](https://github.com/Hashnode/mern-starter/blob/master/client/modules/App/__tests__/App.spec.js) from mern-starter.
- CSS Modules are being used for [style](http://stateofjs.com/2016/css/). It's just standard CSS, but it's scoped per-component, so I can declare the same class names in different pages and not have conflicts. It's great and there's no buy-in or preprocessing.
- Express is our server, it's well established and I can recycle code from both the old repo and the UW authentication system.
- Webpack is used for [bundling](http://stateofjs.com/2016/buildtools/), pretty standard. Basically, it compresses our files, runs fancy local servers, and translates new code into old code IE can run.
- Docker is used to containerize/isolate servers as they're run on the same machine so that they don't interfere with each other. They're wicked easy to configure too (10-12 lines of code?). I use Docker Compose, which is an official tool for running multiple containers at once.
  - This is for deployments. For local development, I have a bash script, `dev.env`, for sanitizing the environment and starting mongo, then you can just run a dev server on your core machine.

There are links to the "State of JavaScript", a study from a few months ago on the web development world. Regarding [features](http://stateofjs.com/2016/features/), we have the following:
- Server Side Rendering
- Code Splitting (Universal React)
- Optimistic Updates (React)
- Hot Reloading (Webpack)
- Time Travel Debugging (Redux Devtools)

I've got a manifest of all technologies in use (equivocal to `wtf.txt`) in STACK.md. It has the real "technical" operational notes. Your `package.json` has a less readable manifest, and `yarn.lock` is a running log of all updates and changes for finding which changes are breaking.

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
