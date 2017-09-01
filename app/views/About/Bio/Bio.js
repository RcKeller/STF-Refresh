import React from 'react'

import { Col, Card } from 'antd'

import styles from './Bio.css'
const Bio = ({name, position, description, photo}) => (
  <Col xs={24} sm={12} md={8} lg={6} xl={4}>
    <Card title={name} bodyStyle={{padding: 0}}>
      <img width='100%' alt='' src={photo} />
      <div className={styles['card-body']}>
        <em>{position}</em>
        <p>{description}</p>
      </div>
    </Card>
  </Col>
)

export default Bio
