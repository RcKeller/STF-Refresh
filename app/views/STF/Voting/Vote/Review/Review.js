import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Row, Col, Switch, Checkbox, Slider, InputNumber, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

class SliderAndNumber extends React.Component {
  render (
    { min, max, step, value } = this.props
  ) {
    return (
      <Row>
        <Col span={12}>
          <Slider {...this.props}  />
        </Col>
        <Col span={4}>
          <InputNumber {...this.props} style={{ marginLeft: 16 }} />
        </Col>
      </Row>
    )
  }
}

//  Questions to ask for metrics
const questions = ['Proposal Quality', 'Academic Merit']

@compose(
  connect(
    (state, props) => ({
      manifest: state.db.manifests[props.index],
      review: state.db.manifests[props.index].reviews.filter(review =>
        // TODO: Remove placeholder for testing
          // review.author._id === state.user._id),
          review.author._id === "5991d88bae3e6f4ad0669bbf")[0] || {},
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Review extends React.Component {
  componentDidMount () {
    const { form, review } = this.props
    if (form && review) {
      //  Consistent fields
      const { score, approved } = review
      //  Dynamic fields - rating prompts change all the time. Normalize
      let qa = {}
      for (const rating of review.ratings) {
        qa[rating.prompt] = rating.score
      }
      let fields = { score, approved, ...qa }
      //  TODO: Remove this test
      fields[questions[0]] = 77
      form.setFieldsValue(fields)
    }
  }
  // handleCategory = (category) => {
  //   const { api, id } = this.props
  //   const update = {  //  Replace publication status only.
  //     proposal: (prev, next) =>
  //       Object.assign(prev, { organization: next.category })
  //   }
  //   api.patch('proposal', { category }, { id, update })
  //   .then(message.success(`Updated category: ${category}`), 10)
  //   .catch(err => {
  //     message.warning(`Failed to update - client error`)
  //     console.warn(err)
  //   })
  // }
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
  render (
    { form, manifest } = this.props,
    { filter } = this.state
  ) {
    const { metrics, voting } = manifest.docket
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
    // console.warn('summary', filteredReviews)
    // const scores = filteredReviews.reduce(function (totals, score) {
    //   console.log('TOTALS', totals)
    //   console.log('SCORE', score)
    //   return totals
    // }, {})
    // console.warn('SCORES', scores)
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h2>Average Scores</h2>
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
              unCheckedChildren='Spectators' checkedChildren='Spectators'
              onChange={spectator => this.handleFilter({ spectator })}
            />
            <h2>Your Review</h2>
            {questions.map((q, i) => (
              <FormItem key={i} label={q} {...layout} >
                {form.getFieldDecorator(q)(
                  // FIXME: Disabling it causes the value to become null by default: disabled={!metrics}... or does it?
                  <SliderAndNumber disabled={!metrics} min={0} max={100} step={1} />
                )}
              </FormItem>
            ))}
            <FormItem label='Total Score' {...layout} >
              {form.getFieldDecorator('score')(
                <InputNumber disabled={!metrics} min={0} max={100} />
              )}
            </FormItem>
            <h2>Final Decision</h2>
            {voting &&
              <FormItem label='I vote to approve this budget' {...layout}>
                {form.getFieldDecorator('approved', { valuePropName: 'checked' })(
                  //  Valueprop is a selector for antd switches, it's in the docs.
                  <Checkbox size='large' />
                )}
              </FormItem>
            }
          </div>
          }
      </section>
    )
  }
}
Review.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  manifest: PropTypes.object,
  user: PropTypes.object
}
export default Review
