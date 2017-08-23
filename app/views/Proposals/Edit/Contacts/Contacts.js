import React from 'react'

import { Row, Col, Alert } from 'antd'

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

class Contacts extends React.Component {
  render () {
    return (
      <div>
        <h1>Contact Information</h1>
        <Alert type='warning'
          message='Contact Responsibilities'
          description='
          As a contact, you will be responsible for the project during its lifecycle, which includes maintaining rapport with the committee and selecting a replacement contact should your university affilitation change (changes in leadership, graduation, etc). After this proposal is published, you will be responsible for selecting a replacement contact should the need arise via the "update" panel.'
        />
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
