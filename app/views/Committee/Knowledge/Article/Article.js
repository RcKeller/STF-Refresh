import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../../services'

import { Spin, Tabs, Badge } from 'antd'
const TabPane = Tabs.TabPane

//  I'm keeping this view simple.
// import View from './View/View'
// import Update from './Update/Update'

import styles from './Article.css'
@compose(
  connect(state => ({ article: state.db.article })),
  connectRequest(props => api.get('article', {
    where: { number: props.params.number }
  }))
)
class Article extends React.Component {
  render ({ article } = this.props) {
    return (
      <article className={styles['tabbed-article']} >
        {!article
          ? <Spin size='large' tip='Loading...' />
          : <Tabs className='tab-container' type='card' >
            <TabPane tab={`KBA ${article.number}`} key='1' className={styles['tab-pane']}>
              <div>View</div>
            </TabPane>
            <TabPane tab='Update' key='2' className={styles['tab-pane']}>
              <div>update</div>
            </TabPane>
          </Tabs>
        }
      </article>
    )
  }
}
Article.propTypes = {
  user: PropTypes.object
}
export default Article
