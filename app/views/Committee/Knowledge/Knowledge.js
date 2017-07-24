import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Link } from 'react-router'
import { Spin, Table } from 'antd'

const columns = [
  {
    title: 'Year',
    dataIndex: 'year',
    key: 'year',
    sorter: (a, b) => (a.date) - (b.date),
    width: 90
  },
  {
    title: 'ID',
    dataIndex: 'number',
    key: 'number',
    sorter: (a, b) => (a.year * a.number) - (b.year * b.number),
    width: 90
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <Link to={`/knowledge/${record.number}`}>{record.title}</Link>
  },
  {
    title: 'Author',
    dataIndex: 'author.name',
    key: 'author.name',
    render: (text, record) => <span>
      {`${record.author.name} (${record.author.netID})`}
      <br />
      <em>{record.position}</em>
    </span>
  },
  // { title: 'Position', dataIndex: 'position' },
  { title: 'Category', dataIndex: 'category', key: 'category' }
]

import styles from './Knowledge.css'
@compose(
  connect((state, props) => ({
    articles: state.db.articles,
    user: state.user,
    screen: state.screen
  })),
  connectRequest((props) => api.get('articles', {
    where: { published: true }
  }))
)
class Knowledge extends React.Component {
  constructor (props) {
    super(props)
    this.state = { myArticles: [] }
  }
  componentWillReceiveProps (nextProps) {
    const { articles, user: { netID } } = nextProps
    if (articles && netID) {
      console.log(nextProps)
      // const myArticles = articles.filter(obj => obj.author.netID === netID)
      const myArticles = articles.filter(obj => obj.author.netID === 'mafalda.conroy66')
      this.setState({ myArticles })
    }
  }
  render (
    { articles, screen } = this.props,
    { myArticles } = this.state
  ) {
    const title = () => <h1>Knowledge Base Articles</h1>
    const footer = () => (
      <div>
        {myArticles &&
          <div>
            <h6>My KBA's</h6>
            {myArticles.map((a, i) =>
              <Link key={i} to={`/knowledge/${a.number}/`}>
                <li>{`${a.number} - ${a.title}`}</li>
              </Link>
            )}
          </div>
        }
        <em>"KBA"s are our way of preserving continuity in STF decisions with dynamic leadership. <Link to='/create'>Click Here</Link> to create a KBA.</em>
      </div>
    )
    return (
      <article className={styles['article']}>
        {!articles
          ? <Spin size='large' tip='Loading...' />
          : (screen.greaterThan.medium
            ? <Table dataSource={articles} sort
              columns={columns}
              title={title}
              footer={footer}
              />
            : <Table dataSource={articles} sort
              size='small'
              columns={columns.slice(0, 3)}
              title={title}
              footer={footer}
            />
          )
        }
      </article>
    )
  }
}
Knowledge.propTypes = {
  articles: PropTypes.array,
  user: PropTypes.object
}
export default Knowledge
