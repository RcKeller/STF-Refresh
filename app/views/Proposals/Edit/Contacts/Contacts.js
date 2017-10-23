import React from 'react'
import PropTypes from 'prop-types'

// import { connect } from 'react-redux'
// import { initialProposalContacts } from '../../../../selectors'

import { Row, Col, Alert } from 'antd'

import Contact from './Contact/Contact'

const contactFields = {
  primary: {
    title: 'Primary Contact',
    subtitle: 'The primary lead and point-of-contact for this project.'
  },
  budget: {
    title: 'Budget Director',
    subtitle: 'Contact for budgetary concerns and handling transfers of funds.'
  },
  organization: {
    title: 'Organizational Head',
    subtitle: 'A departmental head or organization president to officiate this proposal.'
  },
  student: {
    title: 'Student Lead',
    subtitle: '(Optional) We recommend that there be at least one student representing a project, as STF funds are intended for student use.'
  }
}

// @connect(state => ({
//   contacts: initialProposalContacts(state)
// }))
class Contacts extends React.Component {
  static propTypes = {
    validate: PropTypes.func
  }
  render ({ validate, contacts } = this.props) {
    return (
      <div>
        <Alert type='info' banner
          message='Contact Responsibilities'
          description='
          As a contact, you will be responsible for the project during its lifecycle, which includes maintaining rapport with the committee and selecting a replacement contact should your university affilitation change (changes in leadership, graduation, etc). After this proposal is published, you will be responsible for selecting a replacement contact should the need arise via the "update" panel.'
        />
        <h1>Contact Information</h1>
        <Row gutter={32}>
          {Object.keys(contactFields).map((key) => (
            <Col key={key} className='gutter-row' xs={24} md={12} lg={6} >
              <Contact
                role={key}
                title={contactFields[key].title}
                subtitle={contactFields[key].subtitle}
              />
            </Col>
          ))}
          {/* {contactFields.map((c, i) => (
            <Col key={i} className='gutter-row' xs={24} md={12} lg={6} >
              <Contact key={i} {...c} validate={validate} />
            </Col>
          ))} */}
        </Row>
      </div>
    )
  }
}

export default Contacts
