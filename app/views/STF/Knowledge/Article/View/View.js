import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Avatar } from 'antd'

import styles from './View.css'
//  Spreading the connect since we use basically everything.
@connect(state => ({ ...state.db.article }))
class View extends React.Component {
  render ({ date, year, number, author, position, title, category, body } = this.props) {
    return (
      <section>
        <h1>{title}</h1>
        <div className={styles['subheaders']}>
          <div>
            <h3>For {category}</h3>
            <h6>{`KBA: ${number}`}</h6>
          </div>
          <div>
            <Avatar shape='square' size='large' icon='user' />
            <div className={styles['author-text']}>
              <b>{`${author.name} - ${year}`}</b>
              <br />
              <em>{position}</em>
            </div>
          </div>
        </div>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </section>
    )
  }
}

View.propTypes = {
  body: PropTypes.string
}
export default View
