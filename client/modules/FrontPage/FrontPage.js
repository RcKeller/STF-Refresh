import React from 'react'
// import { Link } from 'react-router'
// import { LinkContainer } from 'react-router-bootstrap'

import { Carousel } from 'antd'
// import Jumbotron from '../../components/Jumbotron/Jumbotron'

const settings = {
  className: 'center',
  centerMode: true,
  // centerPadding: 'px',
  dots: true,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
}

const images = [
  'https://photos.smugmug.com/Classroom/i-h6rZ3NP/0/469a2c2c/4K/Campus_August_2016-1576-4K.jpg',
  'https://photos.smugmug.com/Classroom/i-K9xnSdc/0/6f3bc353/4K/_DSC2708-4K.jpg',
  'https://photos.smugmug.com/Classroom/i-TD5DnHh/0/1b4c75e6/4K/Campus_72015-2001-4K.jpg'
]

import styles from './FrontPage.css'
const FrontPage = () => (
  <article>
    <Carousel className={styles['carousel']} autoplay>
      <div>
        <img src={images[0]} />
      </div>
      <div>
        <img src={images[1]} />
      </div>
      <div>
        <img src={images[2]} />
      </div>
      {/* <div><h3>1</h3></div>
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div> */}
    </Carousel>
  </article>
)

export default FrontPage
