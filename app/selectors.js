import { createSelector } from 'reselect'
import _ from 'lodash'
//  https://hackernoon.com/usage-of-reselect-in-a-react-redux-application-fcdca05cc00d
//  http://engineering.blogfoster.com/managing-complexity-in-redux-higher-order-reducers-and-async-state/
//  https://docs.mobify.com/progressive-web/0.15.0/guides/reselect/

/*
BASIC ASYNC SELECTORS
*/
const user = ({ user }) => user || {}
const config = ({ config }) => config || {}
const proposals = ({ db }) => Array.isArray(db.proposals) ? db.proposals : []
const proposal = ({ db }) => db.proposal || {}
const proposalContact = ({ db }) => db.proposal ? db.proposal.contacts : []
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
  [publishedProposals, user],
  (proposals, user) => proposals
    .filter(({ contacts }) => {
      for (const c of contacts) {
        return c.netID === user.netID
      }
    })
)
export const myDrafts = createSelector(
  [unpublishedProposals, user],
  (proposals, user) => proposals
    .filter(({ contacts }) => {
      for (const c of contacts) {
        return c.netID === user.netID
      }
    })
)
//  CONTACT INFORMATION & ROLES
//  The first 4 contacts (selected in proposal drafts). Contains role prop if nonexistent
export const initialProposalContacts = createSelector(
  proposal,
  ({ contacts }) => {
    if (Array.isArray(contacts)) {
      //  Try and find one of each role, returning basic role info if nonexistent.
      let { primary, budget, organization, student } = {}
      primary = contacts.find(c => c && c.role === 'primary') || { role: 'primary' }
      budget = contacts.find(c => c && c.role === 'budget') || { role: 'budget' }
      organization = contacts.find(c => c && c.role === 'organization') || { role: 'organization' }
      student = contacts.find(c => c && c.role === 'student') || { role: 'student' }
      return [primary, budget, organization, student]
    } else {
      return []
    }
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
