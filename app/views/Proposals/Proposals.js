//  React and its typechecking
import React from 'react'
import PropTypes from 'prop-types'
//  Redux utils
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'
//  Our API services
import api from '../../services'

//  Import modular CSS. Needs to run through JS because styles are hashed.
import styles from './Proposals.css'
//  This is a decorator, a function that wraps another class (which in JS is essentially a func)
@compose(
  // Compose is a redux utility that runs an array of functions:
  //  Connect component to cached DB entities
  connect(state => ({ proposals: state.entities.proposals })),
  //  Execute necessary AJAX to load said entities
  connectRequest(() => api.getAll('proposal'))
)
class Proposals extends React.Component {
  //  Shorthand assignment of variables when defining render
  render ({ proposals } = this.props) {
    //  Return mapped content with proposal data. Demonstrates data usage.
    return (
      <article className={styles['article']}>
        <h1>Placeholder - Proposal Browsing</h1>
        <p>
          This page is a stub, but if you look at the codebase, you'll see how we leverage the MVC-Service model and redux-query to load and cache DB entities as this page loads.
        </p>
        <p>
          You'll notice with debug tools that this data does not load until the component begins to load. Yet, the data persists, so we don't need to re-request said data. This reduces the AJAX necessary for our app.
        </p>
        <p>
          Advantages: Data caching, not muddling the load/unload component methods, no need to create standalone redux logic for presentation components... It goes on. This makes our implementation effective and simple - we merely need to map redux to our API services.
        </p>
        <ul>
          {proposals && proposals.map((e, i) => (
            <li key={i}>{e.year}-{e.number} ({e.quarter}): {e.title}</li>
          ))}
        </ul>
      </article>
    )
  }
}

//  Proptypes are an idiomatic way of defining expected values.
//  Flow typing and typescript work well with React, but I'd like to stay unopinionated.
Proposals.propTypes = {
  proposals: PropTypes.array
}
export default Proposals
