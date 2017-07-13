import React from 'react'
import { browserHistory } from 'react-router'

import { Modal, Button, Icon, message } from 'antd'

import Agreements from './Agreements/Agreements'

import styles from './Create.css'
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

export default Create
