import React from 'react'
// import { Link } from 'react-router'
// import { LinkContainer } from 'react-router-bootstrap'

import { Carousel } from 'antd'
// import Jumbotron from '../../components/Jumbotron/Jumbotron'

// import styles from './FrontPage.css'
const FrontPage = () => (
  <article>
    <Carousel vertical='true' autoplay>
      <div><h3>1</h3></div>
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div>
    </Carousel>
  </article>
)

export default FrontPage
