import { createSelector } from 'reselect'
import _ from 'lodash'
//  https://hackernoon.com/usage-of-reselect-in-a-react-redux-application-fcdca05cc00d
//  http://engineering.blogfoster.com/managing-complexity-in-redux-higher-order-reducers-and-async-state/
//  https://docs.mobify.com/progressive-web/0.15.0/guides/reselect/

/*
BASIC ASYNC SELECTORS
*/
const proposals = ({ db }) => Array.isArray(db.proposals) ? db.proposals : []
const user = ({ user }) => user || {}
/*
MEMOIZED SELECTORS
*/
export const publishedProposals = createSelector(
  proposals,
  (proposals) => proposals
    .filter(({ published }) => published) || []
)
export const unpublishedProposals = createSelector(
  proposals,
  (proposals) => proposals
    .filter(({ published }) => !published) || []
)
export const myProposals = createSelector(
  publishedProposals,
  user,
  (proposals, user) => proposals
    .filter(({ contacts }) => {
      for (const c of contacts) {
        return c.netID === user.netID
      }
    }) || []
)
export const myDrafts = createSelector(
  unpublishedProposals,
  user,
  (proposals, user) => proposals
    .filter(({ contacts }) => {
      for (const c of contacts) {
        return c.netID === user.netID
      }
    }) || []
)

// const getConfig = ({db}) => db.config
// export const test = createSelector(
//     getConfig,
//     config => config.enums
// )
// const config = state => _.get(state, 'db.config', {})
// const getDB = state => state.db
// export const test = createAsyncSelector({
//   db: getDB
// })
// export const configID = createSelector(
//   [config],
//   config => config._id
// )()
// export const enums = createSelector(
//   [config],
//   config => config.enums
// )
// export const submissions = createSelector(
//   [config],
//   config => config.submissions
// )
// export const news = createSelector(
//   [config],
//   config => config.news
// )
// export const timeline = createSelector(
//   [config],
//   config => config.timeline
// )
