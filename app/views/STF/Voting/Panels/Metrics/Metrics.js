import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Rate, Input, Button, message } from 'antd'
const { TextArea } = Input
const FormItem = Form.Item
const connectForm = Form.create()

import { makeManifestByID, makeManifestReview } from '../../../../../selectors'
import { layout } from '../../../../../util/form'
import { Loading } from '../../../../../components'
import api from '../../../../../services'

/*
METRICS PANEL:
Allows members to record metrics -
arbitrary scores on various aspects of a proposal
*/
@compose(
  connect(
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      const review = makeManifestReview(manifest)(state) || {}
      const { docket, proposal } = manifest
      return {
        review,
        manifest: manifest._id,
        active: docket.metrics,
        proposal: proposal._id,
        questions: state.config.enums.questions.review || [],
        author: state.user._id
      }
    },
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Metrics extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string.isRequired,
    proposal: PropTypes.string,
    manifest: PropTypes.string,
    questions: PropTypes.array,
    review: PropTypes.object,
    author: PropTypes.string
  }
  componentDidMount () {
    const { form, review } = this.props
    if (form && review) {
      //  Consistent fields
      const { score, ratings, body } = review
      //  Dynamic fields - metric prompts change all the time. Normalize
      //  rc-form format: { metrics: { prompt: score }}
      let metricFields = {}
      if (ratings && ratings.length > 0) {
        for (const i in review.ratings) {
          metricFields[`metrics-${i}`] = review.ratings[i].score
        }
      }
      let fields = Object.assign({ body }, metricFields)
      form.setFieldsValue(fields)
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, manifest, review, author, questions } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const { _id: id } = review
        const { score, body } = values
        const ratings = []
        for (let key of Object.keys(values)) {
          if (key.startsWith('metrics-')) {
            let index = key.replace('metrics-', '')
            const field = {
              prompt: questions[index],
              score: values[`metrics-${index}`]
            }
            ratings.push(field)
          }
        }
        const submission = {
          manifest,
          proposal,
          author,
          ratings,
          score,
          body
        }
        const params = {
          id,
          populate: ['author'],
          transform: manifests => ({ manifests }),
          update: ({ manifests: (prev, next) => {
            let change = prev.slice()
            let manifestIndex = change.findIndex(m => m._id === manifest)
            let reviewIndex = manifestIndex >= 0
              ? change[manifestIndex].reviews
                  .findIndex(r => r._id === id)
              : -1
            reviewIndex >= 0
              ? change[manifestIndex].reviews[reviewIndex] = next
              : change[manifestIndex].reviews.push(next)
            return change
          }})
        }
        params.id
          ? api.patch('review', submission, params)
          .then(message.success('Metrics updated!'), 10)
          .catch(err => {
            message.warning('Metrics failed to update - Unexpected client error')
            console.warn(err)
          })
          : api.post('review', submission, params)
          .then(message.success('Metrics posted!'))
          .catch(err => {
            message.warning('Metrics failed to post - Unexpected client error')
            console.warn(err)
          })
      }
    })
  }
  render (
    { form, active, manifest, questions } = this.props
  ) {
    return (
      <section>
        <br />
        <Loading render={manifest} title='Metrics Panel'>
          <Form onSubmit={this.handleSubmit}>
            {!active && <h4>Metric submissions are closed, but you may view previous scores</h4>}
            {questions.map((q, i) => (
              <FormItem key={i} label={q}>
                {form.getFieldDecorator(`metrics-${i}`)(
                  <Rate disabled={!active} />
                )}
              </FormItem>
            ))}
            <FormItem label='Remarks' {...layout} >
              {form.getFieldDecorator('body')(
                <TextArea rows={4} />
              )}
            </FormItem>
            {/* <br />
            <FormItem label={<b>Overall Score</b>}>
              {form.getFieldDecorator('score')(
                <SliderAndNumber disabled={!active} min={0} max={5} step={1} />
              )}
            </FormItem> */}
            {active &&
              <FormItem>
                <Button size='large' type='primary'
                  style={{ width: '100%' }}
                  htmlType='submit' ghost disabled={!active}
                  >Save Metrics</Button>
              </FormItem>
            }
          </Form>
        </Loading>
      </section>
    )
  }
}

export default Metrics
