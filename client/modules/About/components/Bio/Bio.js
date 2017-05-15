import React from 'react'

import { Col, Card } from 'antd'

// {
//   name: 'Michaella Rogers',
//   position: 'GPSS Treasurer',
//   description: 'Michaella Rogers is a second year Master of Public Administration student at the Evans School of Public Policy and Governance and is also pursuing a Technology Entrepreneurship Certificate from the Foster School of Business. She is interested in working on public-private partnerships or in the business for social good sector. She became involved in student government during her first year of grad school and currently serves as Treasurer for the Graduate and Professional Student Senate. She sits on the Services and Activities Fee Committee and Student Technology Fee Committee and chairs the Finance and Budget Committee and the Travel Grants Committee. Michaella is a Colorado native and graduated from the University of Colorado with a BA in International Relations and Italian. She loves to travel, do yoga, paint, hike, try new restaurants and cook',
//   photo: 'https://uwstf.org/img/bios/michaella.jpg'
// }

import styles from './Bio.css'
const Bio = ({name, position, description, photo}) => (
  <Col xs={24} sm={12} md={8} lg={6} xl={4}>
    <Card title={name} bodyStyle={{padding: 0}}>
      <img alt='' width='100%' src={photo} />
      <div className={styles['card-body']}>
        <em>{position}</em>
        <p>{description}</p>
      </div>
    </Card>
  </Col>
)

export default Bio
