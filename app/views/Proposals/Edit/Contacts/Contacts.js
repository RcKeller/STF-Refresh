import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Row, Col } from 'antd'

import { isContact } from '../../../../util/selectors'
import Contact from './Contact/Contact'

const contactFields = [
  {
    role: 'primary',
    title: 'Primary Contact',
    subtitle: 'The primary lead and point-of-contact for this project.'
  }, {
    role: 'budget',
    title: 'Budget Director',
    subtitle: 'Contact for budgetary concerns and handling transfers of funds.'
  }, {
    role: 'organization',
    title: 'Organizational Head',
    subtitle: 'A departmental head or organization president to officiate this proposal.'
  }, {
    role: 'student',
    title: 'Student Lead',
    subtitle: '(Optional) We recommend that there be at least one student representing a project, as STF funds are intended for student use.'
  }
]

// import styles from './Body.css'
// const jss = {
//   icon: { fontSize: 13 }
// }
@connect(state => ({
  contacts: state.db.proposal.contacts,
  user: state.user
}))
class Contacts extends React.Component {
  render ({ contacts, user } = this.props) {
    console.log(contacts, user)
    return (
      <div>
        <h1>Contact Information</h1>
        <Row gutter={32}>
          {contactFields.map((c, i) => (
            <Col key={i} className='gutter-row' xs={24} md={12} lg={6} >
              <Contact key={i} {...c} />
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}

export default Contacts
