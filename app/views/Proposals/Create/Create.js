import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { browserHistory } from 'react-router'
import api from '../../../services'

import { Modal, Button, message } from 'antd'

import Agreements from './Agreements/Agreements'

import styles from './Create.css'
@connect(
  state => ({
    user: state.user
  }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Create extends React.Component {
  constructor (props) {
    super(props)
    this.state = { modal: false
    }
  }
  showModal = () => {
    this.setState({ modal: true })
  }
  handleOk = () => {
    this.setState({ confirmLoading: true })
    let { api } = this.props
    // let { cancel } = this.handleCancel
    api.post('proposal', {})
    .then(res => {
      message.success(`Proposal Created! Share the link with your team! ID: ${res.body._id}`, 10)
      browserHistory.push(`/edit/${res.body._id}`)
    })
    .catch(err => {
      message.error('An error occured - Draft failed to update')
      console.warn(err)
    })
    setTimeout(() => {
      this.setState({
        modal: false,
        confirmLoading: false
      })
    }, 2000)
  }
  handleCancel = () => {
    console.log('Clicked cancel button')
    this.setState({ modal: false })
  }
  // initializeProposal () {
  //   console.log('test')
  //   let id = '5951710b0d789f25e4061adc'
  //   message.success(`Successfully created new proposal! Your ID: ${id}`, 10)
  //   browserHistory.push(`/edit/${id}`)
  // }
  render ({ modal, confirmLoading, ModalText } = this.state) {
    return (
      <article className={styles['page']}>
        <h1>Proposal Agreement</h1>
        <p>
          The Student Technology Fee Committee was created to ensure the best return on collected student dollars. By proposing to the committee, you agree to follow all requirements, current and future, set by the STFC. Included below are particularly relevant documents, along with brief summary and their full text.
        </p>
        <Agreements />
        {/* <Button size='large' type='primary'
          onClick={() => this.initializeProposal()}
        >
          I Agree<Icon type='right' />
        </Button> */}
        <Button type='primary' onClick={this.showModal}>Open</Button>
        <Modal title='Title' visible={modal}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
        >
          <p>CONTENT</p>
        </Modal>
      </article>
    )
  }
}
Create.propTypes = {
  api: PropTypes.object
}

export default Create
