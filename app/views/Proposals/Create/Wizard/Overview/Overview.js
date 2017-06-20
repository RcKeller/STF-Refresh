import React from 'react'
import { Field } from 'redux-form'

import { Input } from '../../../../../components/Form/Form'

import { Row, Col } from 'antd'

const impactTypes = [
  {
    title: 'Academic Experience',
    subtitle: 'How will this project enrich a student’s learning environment and experience?',
    field: 'academic'
  }, {
    title: 'Research Involvement',
    subtitle: 'Can this project be used for scholarly research?',
    field: 'research'
  }, {
    title: 'Career Development',
    subtitle: 'Can this technology be used to further a student’s career?',
    field: 'career'
  }
]

import styles from './Overview.css'
class Overview extends React.Component {
  render () {
    return (
      <div>
        <Row gutter={64}>
          <Col className='gutter-row' xs={24} md={12}>
            <h2>Abstract</h2>
            <p><em>
              A brief summary of the proposal and the technology being made available to students.
            </em></p>
            <Field name='body.overview.abstract' component={Input} type='textarea' rows={6} />
          </Col>
          <Col className='gutter-row' xs={24} md={12}>
            <h2>Key Objectives</h2>
            <p><em>
              The changes proposed and the desired outcome.
            </em></p>
            <Field name='body.overview.objectives' component={Input} type='textarea' rows={6} />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <h2>Core Justification</h2>
            <p><em>
              Briefly describe the outstanding student need for this technology and the justification for this project.
            </em></p>
            <Field name='body.overview.justification' component={Input} type='textarea' rows={4} />
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24}>
            <h2>Student Impact</h2>
            <p><em>
              Describe the impact on the student academic experience in the following areas. Not every proposal will affect all areas.
            </em></p>
          </Col>
          {impactTypes.map((impact, i) => (
            <Col key={i} className='gutter-row' xs={24} md={8}>
              <h3>{impact.title}</h3>
              <p className={styles['subtitle']}><em>{impact.subtitle}</em></p>
              <Field name={`body.overview.impact.${impact.field}`} component={Input} type='textarea' rows={4} />
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}

export default Overview
