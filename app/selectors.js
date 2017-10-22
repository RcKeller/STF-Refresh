import { createSelector } from 'reselect'
import _ from 'lodash'
//  https://hackernoon.com/usage-of-reselect-in-a-react-redux-application-fcdca05cc00d
//  http://engineering.blogfoster.com/managing-complexity-in-redux-higher-order-reducers-and-async-state/
//  https://docs.mobify.com/progressive-web/0.15.0/guides/reselect/
/*
SORTATION FUNCTIONS
*/
export const sortProposals = (a, b) => {
  if (a.year > b.year) return -1
  if (a.year >= b.year && a.number > b.number) return -1
  return 1
}

export const sortManifestsByProposal = (a, b) => {
  const { proposal: prevProposal } = a
  const { proposal } = b
  if (prevProposal && proposal) {
    if (prevProposal.year > proposal.year) return -1
    if (prevProposal.year >= proposal.year && prevProposal.number > proposal.number) return -1
  }
  return 1
}

/*
BASIC ASYNC SELECTORS
*/
const user = ({ user }) => user || {}
const config = ({ config }) => config || {}
const proposals = ({ db }) => Array.isArray(db.proposals)
  ? db.proposals.sort(sortProposals)
  : []

const proposal = ({ db }) => db.proposal || {}
const proposalContacts = ({ db }) => db.proposal ? db.proposal.contacts : []
const proposalManifests = ({ db }) => db.proposal ? db.proposal.manifests : []
// (a, b) =>
//   a.year * a.number - b.year * b.number,
/*
MEMOIZED SELECTORS
*/
//  PUBLICATION STATUS / OWNERSHIP
export const publishedProposals = createSelector(
  [proposals],
  (proposals) => proposals
    .filter(({ published }) => published)
)
export const unpublishedProposals = createSelector(
  [proposals],
  (proposals) => proposals
    .filter(({ published }) => !published)
)

export const myProposals = createSelector(
  [proposals, user],
  (proposals, user) =>
    proposals.filter(({ contacts }) =>
      Array.isArray(contacts)
        ? contacts.findIndex(c => c.netID === user.netID) >= 0
        : false
    )
)
export const myDrafts = createSelector(
  [unpublishedProposals, user],
  (proposals, user) =>
    proposals.filter(({ contacts }) =>
      Array.isArray(contacts)
        ? contacts.findIndex(c => c.netID === user.netID) >= 0
        : false
    )
)
export const myPublished = createSelector(
  [publishedProposals, user],
  (proposals, user) =>
  proposals.filter(({ contacts }) =>
    Array.isArray(contacts)
      ? contacts.findIndex(c => c.netID === user.netID) >= 0
      : false
  )
)
//  CONTACT INFORMATION & ROLES
//  The first 4 contacts (selected in proposal drafts). Contains role prop if nonexistent
export const initialProposalContacts = createSelector(
  proposalContacts,
  (contacts) => {
    //  Try and find one of each role, returning basic role info if nonexistent.
    let arrangedContacts = [{}, {}, {}, {}]
    arrangedContacts[0] = contacts.find(c => c && c.role === 'primary') || { role: 'primary' }
    arrangedContacts[1] = contacts.find(c => c && c.role === 'budget') || { role: 'budget' }
    arrangedContacts[2] = contacts.find(c => c && c.role === 'organization') || { role: 'organization' }
    arrangedContacts[3] = contacts.find(c => c && c.role === 'student') || { role: 'student' }
    return arrangedContacts
  }
)

export const proposalSigners = createSelector(
  proposalContacts,
  (contacts) => {
    //  Try and find one of each role, returning basic role info if nonexistent.
    return contacts.filter(c => c._id)
  }
)

export const readyToPublish = createSelector(
  proposal,
  ({ contacts }) => {
    if (Array.isArray(contacts)) {
      const required = ['primary', 'budget', 'organization']
      let signatures = 0
      const requiredSignatures = 3
      for (let role of required) {
        let user = contacts.find(c => c.role === role)
        if (user.signature) signatures++
      }
      return signatures >= requiredSignatures
    } else {
      return false
    }
  }
)

//  MANIFEST-PROPOSAL SELECTORS

export const proposalDecision = createSelector(
  [proposalManifests],
  (manifests) => {
    let manifest = manifests.find(m => m && m.decision)
    return manifest ? manifest.decision : {}
  }
)
export const indexOfApprovedManifest = createSelector(
  [proposalManifests],
  (manifests) => {
    let index = manifests.findIndex(m => m.decision && m.decision.approved)
    return index > 0 ? index : 0
  }
)

export const manifestsByProposal = ({ db }) => {
  return Array.isArray(db.manifests)
  ? db.manifests.filter(m => m.proposal).sort(sortManifestsByProposal)
  : []
}
export const manifestsOnDocket = createSelector(
  [manifestsByProposal],
  (manifests) => manifests.filter(({docket}) => docket.metrics || docket.voting || docket.decisions)
)

const manifests = ({db}) => db.manifests || []
//  PRIVATE SELECTOR - construct one per component
//  const manifestByID = makeManifestByID()
// const manifest = makeManifestByID(props.id)(state)
export const makeManifestByID = (id) => createSelector(
  [manifests],
  (manifests) => Array.isArray(manifests)
    ? manifests.find(m => m._id === id)
    : {}
)

//
