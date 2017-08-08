import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

@compose(
  connect(
    (state, props) => ({
      manifest: state.db.manifests[props.index],
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class MetricsPane extends React.Component {
  // componentDidMount () {
  //   const { form, id, category, organization, budget, uac, status, published } = this.props
  //   if (id) {
  //     form.setFieldsValue({ category, organization, budget, uac, status, published })
  //   }
  // }
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
  render ({ manifest } = this.props) {
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <div>
            Metrics Pane
          </div>
          }
      </section>
    )
  }
}
MetricsPane.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  manifest: PropTypes.object,
  user: PropTypes.object
}
export default MetricsPane
