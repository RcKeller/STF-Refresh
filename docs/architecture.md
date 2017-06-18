# Principles

I've gone over a lot of the principles behind the design of this website in `README.md`, but here I'd like to touch on some of the more technical principles:

Single Source of Truth
: Client-side data should only have one source, and that is the Redux store. It is immutable to prevent errors, but also to enable robust debugging and testing.

Feature-Oriented Architecture
: Instead of organizing by code function via folders like `actions`, `reducers`, etc - make components, styles, and logic central to the feature.

Consolidated Redux Logic in Duck Form
: Flux gets complicated and heavy, fast. It's also one of the most predictable and stable forms of state management. Keep all logic for initializing redux centralized, and component logic should be in an associated `ducks.js` next to the component. See the [Ducks Proposal](https://github.com/erikras/ducks-modular-redux) and some great implementations in this [Medium article](https://medium.com/front-end-hacking/structuring-react-and-redux-applications-255361d24f84).

Agnostic Data
: Models and controllers should contain as little business logic as humanly possible, and instead allow the routes to request data queried in different ways. The STF is an *incredibly dynamic* organization, with our core practices expected to change often. We are also stewards of UW in our practices, in sharing open-source and reusable code. Business logic is tied to its client sided features, which are expected to change often. As such, *business logic should be client-sided*, with the exception of data joins.

Traceable Concerns
: Bugs in a financial application will put the entire org at risk. Logic should have traceable, predictable origins and paths - the project should be architected so that CRUD operations go through standard routes without any "hackery".

# Design Pattern

Full-Stack React-Redux apps have a hard time conforming strictly to the MVC design pattern, because Redux has to have its own unique controllers / logic. However, MVC makes sense and is a tried-and-true standard. So I have come up with what I will call MVCS

| | |
| :------------- | -------------: |
Model | Defines Schema
View | Rendered Content
Controller | Data Sources
Service | Maps Controllers to Redux State

As mentioned before, Redux logic gets out of hand easily. But by using `redux-query` middleware, we can map our queries to our state, and load / cache data as routes change.

# Project Structure

This is a full-stack app, but pages are actually rendered on both the client and server side. For more information on this, look up isomorphic rendering with React.

### Client Side (`app/`)
| | |
| :------------- | -------------: |
css/ | Top-level style models
images/ | Static content (favicons, etc)
services/ | Services for controllers (See above)
tests/ | Unit Testing (Enzyme)
views/ | React Components

You may notice that I don't define components as constants - they're all classes. People will argue against this, citing inefficiency, [which is an extremely common misconception](https://medium.com/modus-create-front-end-development/component-rendering-performance-in-react-df859b474adc).

I also don't use the container/component structure common in the community. This was never really idiomatic, just a [common observation](https://twitter.com/dan_abramov/status/668585589609005056?lang=en), and not only does it not matter from a scaffolding point of view, you can tell if it's smart just by opening it.

### Server Side (`server/`)
| | |
| :------------- | -------------: |
db/ | Database logic
db/dummies | Fake data generators
db/passport | DB auth logic
init/express | Initialize Express & middlewares
init/routes | API routes for all controllers
init/passport | Initialize auth strategies
render/ | Isomorphic Rendering Logic
render/middleware | Sets initial redux store (mostly authN/authZ)
render/pageRenderer | Renders the server side page
render/static-assets | Vendor-prefixed tags for minified files, CDNs, etc

### Module Bundler (`webpack/`)
Will document this when production ready. But FYI, the module bundle changes based on if the browser is present and if it's production or dev.
Running this server will initialize both the client and server, which means that what are traditionally devDependencies are included as normal dependencies. However, there is no performance impact.
