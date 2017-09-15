import { createSelector, createStructuredSelector } from 'reselect'
// import _ from 'lodash'
//  http://engineering.blogfoster.com/managing-complexity-in-redux-higher-order-reducers-and-async-state/
//  https://docs.mobify.com/progressive-web/0.15.0/guides/reselect/

const getConfig = ({db}) => db.config
export const test = createSelector(
    getConfig,
    config => config.enums
)
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
