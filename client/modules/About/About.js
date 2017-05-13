import React from 'react'

import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

const LoremIpsumImage = 'https://uwstf.org/img/bios/alec.jpg'

import styles from './About.css'
const About = () => (
  <article id={styles['about']}>
    <h1>
      <p id='simple-first'>
        What is the Student Technology Fee?
      </p>
    </h1>
    <p id='simple-first'>
        The Student Technology Fee is a $38 per quarter fee paid by all matriculated students of the University of Washington. The STF pays for additional technological needs of students, both in and out of their regular classes. The STF was created under the powers given by the Washington State Legislature's <a href='http://apps.leg.wa.gov/RCW/default.aspx?cite=28b.15.051'>Technology Fee</a> article, and the University of Washington's <a href='https://www.washington.edu/regents/'>Board of Regents</a>.
    </p>
    <h2>The Committee</h2>
    <p>
        The money brought in by The Student Technology Fee is appropriated by the STF Committee. A gropu of nine voting members, appointed by both the <a href='http://asuw.org'>Associated Students of the University of Washington</a>, and the <a href='http://depts.washington.edu/gpss/home'>Graduate and Professional Student Senate</a>, accepts proposals for the expenditure of STF funds. Throughout the regular school season, proposal authors present to the committee on why their proposal should be funded.
    </p>
    <p>
        The committee regularly appropriates just shy of $5 million into almost one hundred proposals yearly. Any remaining funds by the end of spring quarter are rolled into the next fiscal year.
    </p>
    <p>
      The Student Technology Fee is entirely student operated and funded. While department heads can request money, funds must always be allocated to student uses. Any technology funded by the STF Committee is appropriated for students only.
    </p>
    <div className={styles['members']}>
      <Row>
        <div className={styles['member-wrapper']}>
          <Col xs={12} sm={12} md={12} lg={6}>
            <Col xs={2} sm={4} md={3} lg={4}>
              <img src={LoremIpsumImage} />
            </Col>
            <Col xs={10} sm={8} md={9} lg={8}>
              <h2>Name</h2>
              <span>Subtitle</span>
              <p>Description</p>
            </Col>
          </Col>
        </div>
      </Row>
    </div>
  </article>
)

export default About
