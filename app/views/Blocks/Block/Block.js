import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import styles from './block.css'
@compose(
  connect((state, props) => ({ block: state.entities.block[0] })),
  connectRequest((props) => api.getWithQuery('block', {
    query: { number: props.params.number },
    join: ['contacts']
  }
  // { number: props.params.number }
  //http://localhost:3000/v1/block?query={%22number%22:%2270692%22}&populate=%22contacts%22
))
  // connectRequest((props) => api.get('block', props.params.id, {
  //   populate: 'contacts'
  // }))
)
class Block extends React.Component {
  render ({ block } = this.props) {
    return (
      <article className={styles['article']}>
        {block &&
          <div>
            <h1>block {block.year}-{block.number}</h1>
            <h2>{block.title}</h2>
            <hr />
            <p>{JSON.stringify(block)}</p>
          </div>
        }
      </article>
    )
  }
}

Block.propTypes = {
  block: PropTypes.object
}
export default Block
