# Database

In the interest of minimizing technical debt and preserving continuity for developers at UW, I've chosen a technical stack that is as simple as possible and easy to scale. In addition, I also have to make sure that I am using in-demand frameworks and database tech that is here to stay. For this reason, I've chosen MongoDB - UW turns out a lot of students with entrepenurial and statistics backgrounds, which is often work Mongo is suited for.

Mongo combined with Mongoose makes working with our data super easy, especially considering Mongo has roots in the JSON format. Our data is light on nesting, but we use ObjectId's to populate extra data as necessary. For example, if you get all proposals, it will contain top level data like the title, department, and status, but for the actual business case, reports, etc you will have to `populate()` the data via mongoose. Which, with our API, is simply including a boolean for each field we want to hydrate.

### Initialize DB

Here's a script to initialize a MongoDB container on Windows (open source version ONLY):

```bash
echo "== STOPPING ALL CONTAINERS =="
docker stop $(docker ps -a -q)

echo "== REFRESH ENVIRONMENT =="
export MONGO_URL=mongodb://$(docker-machine ip):27017/uw
echo MONGO_URL set to $MONGO_URL

echo "== LOADING DB =="
docker run -d -p 27017:27017 mongo
docker ps

echo "== ENVIRONMENT READY =="
echo DB LIVE: $MONGO_URL
```


# Schema Design

### Proposal
```js
_id (year-number) (require)
year: Integer (require)
number: Integer (require)
quarter: String (enum) (autumn, winter, spring, summer)

title: String (require)
category: String (enum) ...
uac: Boolean (default false)
organization: String (enum) ...
contacts: [populate contact(s)]

body: [Populate content(s)]

status: String (enum)
asked: Integer
received: Integer (optional)

manifests: [populate manifest(s)],

comments: [populate comment(s)]

amendments : [populate amendment(s)]

reports: [populate report(s)]
```

### Contact:
```js
type: String (enum) - Primary, Budget, Dean, Student
netID: String (unique)
name: String (required)
title: String (required)
phone: String
mailbox: String
signature: Boolean (required, default false)
```

Case:
```js
overview: {
  abstract: String (required),
  objectives: [String] (required),
  justification: String (required)
},
plan: {
  state: {
    current: String (req),
    future: String (req)
  },
  availability: {
    current: String (req),
    future: String (req)
  },
  strategy: {
    current: String (req),
    future: String (req)
  },
  outreach: {
    current: String (req),
    future: String (req)
  },
  risk: {
    current: String (req),
    future: String (req)
  },

},
//  Legacy contains old fields, stored in key-values and mapped to render.
legacy: [{
  title: String
  body: String
}],
```

### Amendment (supplemental):
```js
contact: [populate contact]
title: String (require),
body: String (require),
decision: String
approved: Boolean
```

### Comment
```js
proposal: String,
internal: Boolean (for votes/metrics),
user: [populate user],
title: String (require),
body: String (require),
date: Date,
```

### Review
```js
proposal: String,
user: [populate user]
body: String
decision: Boolean (require),
score: Int (require),
ratings: [{
  // breakdown scores go here.
}]
```

### Decision
```js
approved: Boolean (require),
author: [populate User],
body: String (req)
```

### Report
TODO: Add budget, reporting and award logic here. Somewhat unclear.

### Block
```js
_id (number) (require)
year: Integer (require)
number: Integer (require)

title: String (require)
organization: String (enum) ...
contacts: [populate contact(s)]

status: String (enum)

asked: Integer
received: Integer (optional)

body: {
  overview: {
    abstract: String (required),
    objectives: [String] (required)
  },
  plan {
    state: String (req),
    strategy: String (req),
    risk: String (req)
  }
}
```

### Manifest
```js
original: Boolean (false if partial)
Items: [{
  title: String,
  description: String,
  quantity: Integer,
  price: Integer,
  priority: Integer,
  taxExempt: Boolean (default false)
  }]
tax: Integer (default 10.1),
total: Integer (recalculate on changes using pre)
```

### User
```js
authenticated:
netID: String,
name: String,
email: String,
proposals: [populate contact(s)],
committee: (optional, no default) {
  spectator: Boolean
  member: Boolean
  admin: Boolean
}
```
