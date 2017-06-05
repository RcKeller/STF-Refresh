Proposal:
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

Contact:
  type: String (enum) - Primary, Budget, Dean, Student
  netID: String (unique)
  name: String (required)
  title: String (required)
  phone: String
  mailbox: String
  signature: Boolean (required, default false)


BusinessCase:
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

Amendment (supplemental):
  contact: [populate contact]
  title: String (require),
  body: String (require),
  decision: String
  approved: Boolean


Comment
  proposal: String,
  internal: Boolean (for votes/metrics),
  user: [populate user],
  title: String (require),
  body: String (require),
  date: Date,

Review
  proposal: String,
  user: [populate user]
  body: String
  decision: Boolean (require),
  score: Int (require),
  ratings: [{
    // breakdown scores go here.
  }]

Decision
  approved: Boolean (require),
  author: [populate User],
  body: String (req)


  // TODO: Add budget, reporting and award logic here. Somewhat unclear.

Block
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


Manifest
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

User:
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
