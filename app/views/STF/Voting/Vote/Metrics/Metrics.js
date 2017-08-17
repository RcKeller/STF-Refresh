import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'

import { Spin, Form, Row, Col, Switch, Checkbox, Slider, InputNumber, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

@ connect(
    (state, props) => ({
      proposal: state.db.manifests[props.index].proposal._id,
      manifest: state.db.manifests[props.index],
      review: state.db.manifests[props.index].reviews.find(review =>
          review.author._id === state.user._id
        ) || {},
      user: state.user,
    })
)
class Review extends React.Component {
  constructor (props) {
    super(props)
    const filter = { admin: true, member: true, spectator: true }
    this.state = { filter }
  }
  handleFilter = (checked) => {
    // console.log(checked)
    const filter = Object.assign(this.state.filter, checked)
    this.setState({ filter })
  }
  filterReviews = () => {
    const { manifest } = this.props
    const { filter } = this.state
    //  FILTER REVIEWS BY ROLE
    //  All reviews, filtered and sorted by type (will have duplicates across keys, STF members have many roles)
    const reviews = {
      admin: manifest.reviews.filter(rev => filter.admin && rev.author.stf.admin === true),
      member: manifest.reviews.filter(rev => filter.member && rev.author.stf.member === true),
      spectator: manifest.reviews.filter(rev => filter.spectator && rev.author.stf.spectator === true)
    }
    //  Create a set (array w/ unique values) by spreading all the review types we've filtered
    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
    //  https://gist.github.com/telekosmos/3b62a31a5c43f40849bb#gistcomment-1830283
    const filteredReviews = [...new Set([
      ...reviews.admin,
      ...reviews.member,
      ...reviews.spectator
    ])]
    console.warn('summary', filteredReviews)

    //  CALCULATE AVERAGE SCORES
    let pass = 0
    let fail = 0
    let metrics = filteredReviews.reduce((total, votes) => {
      //  Assign approvals, accounting for null/undef
      if (votes.approved === true) pass++
      if (votes.approved === false) fail++
      //  Loop over unique ratings
      for (const i in votes.ratings) {
        const { prompt, score } = votes.ratings[i]
        //  If they're complete records, record them
        if (prompt && Number.isInteger(score)) {
          //  Initialize field for prompt if necessary
          const promptAccountedFor = total[prompt]
          if (!promptAccountedFor) total[prompt] = {}
          //  Add score and increment count
          Number.isInteger(total[prompt].score)
            ? (total[prompt].score += score)
            : (total[prompt].score = score)
          Number.isInteger(total[prompt].count)
            ? (total[prompt].count ++)
            : (total[prompt].count = 1)
        }
      }
      return total
    }, {})
    //  Now we have a list of scores and counts keyed by their prompt. Calc the average.
    Object.keys(metrics).forEach((key, i) => {
      metrics[key] = metrics[key].score / metrics[key].count
    })
    console.warn('pass, fail and metrics', pass, fail, metrics)
    return metrics
  }
  render (
    { form, manifest, user } = this.props,
    { filter } = this.state
  ) {
    const { metrics, voting } = manifest.docket
    const total = this.filterReviews()
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h2>Scores & Metrics</h2>
            <h4>Filter by Commitee Roles</h4>
            <Switch checked={filter.admin}
              unCheckedChildren='Admins' checkedChildren='Admins'
              onChange={admin => this.handleFilter({ admin })}
            />
            <Switch checked={filter.member}
              unCheckedChildren='Members' checkedChildren='Members'
              onChange={member => this.handleFilter({ member })}
            />
            <Switch checked={filter.spectator}
              unCheckedChildren='Ex-Officios' checkedChildren='Ex-Officios'
              onChange={spectator => this.handleFilter({ spectator })}
            />
            {/* <br />
            <span>Approve: {total.approved.for}</span>
            <br />
            <span>Against: {total.approved.against}</span> */}
          </div>
          }
      </section>
    )
  }
}
Review.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  proposal: PropTypes.string,
  manifest: PropTypes.object,
  review: PropTypes.object,
  user: PropTypes.object
}
export default Review
