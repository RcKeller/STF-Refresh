import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest, querySelectors } from 'redux-query'

import api from '../../../services'

import { Spin, Collapse } from 'antd'
const Panel = Collapse.Panel

const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

const testContacts = [
  {
    role: 'primary',
    name: 'name',
    netID: 'id',
    title: 'title',
    email: 'email here',
    phone: 999,
    mailbox: 'addr'
  }
]
const query = (props) => ({
  model: 'block',
  query: { number: props.params.number },
  join: ['contacts', 'decision']
})

import styles from './block.css'
@compose(
  connect((state, props) => ({
    block: state.entities.block || {},
    loading: querySelectors.isPending(state.queries, api.get(query(props)))
  })),
  connectRequest((props) => api.get(query(props)))
)
class Block extends React.Component {
  render ({ block, loading } = this.props) {
    return (
      <article className={styles['article']}>
        {loading
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h5>{block.year}-{block.number}</h5>
            <h1>{block.title}</h1>
            <h2>For {block.organization}</h2>
            <Collapse>
              {testContacts.map((contact, i) => (
                <Panel key={i} header={`${capitalize(contact.role)} Contact: ${contact.name}, ${contact.title}`}>
                  <ul>
                    <li>NetID: {contact.netID}</li>
                    <li>Email: {contact.email}</li>
                    <li>Phone: {contact.phone}</li>
                    <li>Mailbox: {contact.mailbox}</li>
                  </ul>
                </Panel>
              ))}
            </Collapse>
            {block.body &&
              <div>
                <h2>Project Overview</h2>
                <p>{block.body.overview.abstract}</p>
                <h3>{block.body.objectives}</h3>
              </div>
            }
            {/* <p>{block.body}</p> */}
            <p>{JSON.stringify(block.body)}</p>
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
