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
          <Slider {...this.props} />
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
      proposal: state.db.manifests[props.index].proposal._id,
      manifest: state.db.manifests[props.index],
      review: state.db.manifests[props.index].reviews.find(review =>
          review.author._id === state.user._id
        ) || {},
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
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
    const { form, manifest } = this.props
    const { filter } = this.state
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
  }
  componentDidMount () {
    const { form, review } = this.props
    if (form && review) {
      //  Consistent fields
      const { score, approved } = review
      //  Dynamic fields - metric prompts change all the time. Normalize
      //  rc-form format: { metrics: { prompt: score }}
      let metrics = { }
      for (const q of review.ratings) {
        metrics[q.prompt] = q.score
      }
      let fields = { score, approved, metrics }
      form.setFieldsValue(fields)
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, manifest, review, user } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.warn('Submitting', values)
        const { metrics, score, approved } = values
        let denormalizedMetrics = []
        //  Denormalize prompts into scores: [{ prompt, score }]
        Object.keys(metrics).forEach((key, i) => {
          denormalizedMetrics.push({ prompt: key, score: metrics[key] })
        })
        const submission = {
          proposal,
          manifest: manifest._id,
          author: user._id,
          ratings: denormalizedMetrics,
          score,
          approved
        }
        console.warn('Review', submission)
        //  TODO: Add custom update func
        review._id
          ? api.patch('review', submission, { id: review._id })
          .then(message.success('Review updated!'))
          .catch(err => {
            message.warning('Review failed to update - Unexpected client error')
            console.warn(err)
          })
          : api.post('review', submission)
          .then(message.success('Review posted!'))
          .catch(err => {
            message.warning('Review failed to post - Unexpected client error')
            console.warn(err)
          })
      }
    })
  }
  render (
    { form, manifest } = this.props,
    { filter } = this.state
  ) {
    const { metrics, voting } = manifest.docket
    this.filterReviews()
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col sm={24} xl={12}>
                <h2>Your Review</h2>
                {questions.map(q => (
                  <FormItem key={q} label={q} {...layout} >
                    {form.getFieldDecorator(`metrics[${q}]`)(
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
                <h4>{voting ? 'Voting is now open. Be forewarned, these decisions are final' : 'Voting is currently closed'}</h4>
                <FormItem label='I vote to approve this budget' {...layout}>
                  {form.getFieldDecorator('approved', { valuePropName: 'checked' })(
                    //  Valueprop is a selector for antd switches, it's in the docs.
                    <Checkbox disabled={!voting} size='large' />
                  )}
                </FormItem>
                <FormItem>
                  <Button size='large' type='primary'
                    htmlType='submit' ghost disabled={!metrics && !voting}
                    >Update your Review</Button>
                </FormItem>
              </Col>
              <Col sm={24} xl={12}>
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
                  unCheckedChildren='Ex-Officios' checkedChildren='Ex-Officios'
                  onChange={spectator => this.handleFilter({ spectator })}
                />
              </Col>
            </Row>
          </Form>
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
