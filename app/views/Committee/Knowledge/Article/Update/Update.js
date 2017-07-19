import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'

import RichTextEditor from 'react-rte'
import { Button, message } from 'antd'

@connect(
  state => ({
    id: state.db.article._id,
    body: state.db.article.body
  }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Update extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: RichTextEditor.createValueFromString(props.body, 'html'),
      loading: false
    }
  }

  onChange = (value) => this.setState({ value })

  handleUpdate = () => {
    this.setState({ loading: true })
    const body = this.state.value.toString('html')
    const { api, id } = this.props
    api.patch(
      'article',
      { body },
      { id }
    )
    .then(message.success(`Updated!`))
    .catch(err => {
      message.warning(`Update failed - Unexpected error`)
      console.warn(err)
    })
    .then(this.setState({ loading: false }))
  }
  render ({ value } = this.state) {
    return (
      <section>
        <RichTextEditor
          value={this.state.value}
          onChange={this.onChange}
        />
        <Button size='large' type='primary'
          loading={this.state.loading}
          onClick={this.handleUpdate}
        >Update</Button>
      </section>
    )
  }
}

Update.propTypes = {
  api: PropTypes.object,
  id: PropTypes.string,
  body: PropTypes.string
}
export default Update
