import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Spin, Row, Col, Switch, Progress, Table } from 'antd'

const columns = [
  { title: 'Prompt', dataIndex: 'prompt', key: 'prompt' },
  { title: 'Score', dataIndex: 'score', key: 'score', width: 100 }
]

@ connect(
    (state, props) => ({
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id),
      user: state.user
    })
)
class Scores extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string.isRequired,
    proposal: PropTypes.string,
    manifest: PropTypes.object,
    review: PropTypes.object,
    user: PropTypes.object
  }
  constructor (props) {
    super(props)
    const filter = { admin: true, member: true, spectator: true }
    this.state = { filter }
  }
  handleFilter = (checked) => {
    // console.log(checked)
    const filter = Object.assign(this.state.filter, checked)
    this.setState({ filter })
  }
  filterReviews = () => {
    const { manifest } = this.props
    const { filter } = this.state
    //  Initialize returns. If reviews exist, we filter, otherwise just return defaults.
    let pass = 0
    let fail = 0
    let metrics = []
    if (manifest.reviews && manifest.reviews.length > 0) {
      //  FILTER REVIEWS BY ROLE
      //  All reviews, filtered and sorted by type (will have duplicates across keys, STF members have many roles)
      const reviews = {
        admin: manifest.reviews.filter(rev => filter.admin && rev.author.stf.admin === true),
        member: manifest.reviews.filter(rev => filter.member && rev.author.stf.member === true),
        spectator: manifest.reviews.filter(rev => filter.spectator && rev.author.stf.spectator === true)
      }
      //  Create a set (array w/ unique values) by spreading all the review types we've filtered
      //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
      //  https://gist.github.com/telekosmos/3b62a31a5c43f40849bb#gistcomment-1830283
      const filteredReviews = [...new Set([
        ...reviews.admin,
        ...reviews.member,
        ...reviews.spectator
      ])]
      console.warn('summary', filteredReviews)

      //  CALCULATE AVERAGE SCORES
      metrics = filteredReviews.reduce((total, votes) => {
        //  Assign approvals, accounting for null/undef
        if (votes.approved === true) pass++
        if (votes.approved === false) fail++
        //  Loop over unique ratings
        for (const i in votes.ratings) {
          const { prompt, score } = votes.ratings[i]
          //  If they're complete records, record them
          if (prompt && Number.isInteger(score)) {
            //  Initialize field for prompt if necessary
            const promptAccountedFor = total[prompt]
            if (!promptAccountedFor) total[prompt] = {}
            //  Add score and increment count
            Number.isInteger(total[prompt].score)
              ? (total[prompt].score += score)
              : (total[prompt].score = score)
            Number.isInteger(total[prompt].count)
              ? (total[prompt].count ++)
              : (total[prompt].count = 1)
          }
        }
        return total
      }, {})
      //  Now we have a list of scores and counts keyed by their prompt. Calc the average.
      Object.keys(metrics).forEach((key, i) => {
        metrics[key] = metrics[key].score / metrics[key].count
      })
    }
    //  Final return, assign as const { a,  b, c } =...
    return { pass, fail, metrics }
  }
  render (
    { form, manifest, user } = this.props,
    { filter } = this.state
  ) {
    const { pass, fail, metrics } = this.filterReviews()
    const dataSource = Object.keys(metrics).map(key => {
      return { prompt: key, score: metrics[key] }
    })
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h2>Committee Scores</h2>
            <h6>For internal use only.</h6>
            <h4>Filter by Commitee Roles</h4>
            <h1 className='demo-note' style={{ color: 'goldenrod' }}>UNCLEAR BUSINESS LOGIC</h1>
            <p className='demo-note' style={{ color: 'goldenrod' }}>Should this refresh after you issue a vote, or not? Currently, you have to force updates with the refresh button (top right tab on the page). And should this really be a separate page? I made these current decisions to keep voting impartial and encourage group polarization during voting, instead of people just voting based on the rest of the group.</p>
            <Switch checked={filter.admin}
              unCheckedChildren='Admins' checkedChildren='Admins'
              onChange={admin => this.handleFilter({ admin })}
            />
            <Switch checked={filter.member}
              unCheckedChildren='Members' checkedChildren='Members'
              onChange={member => this.handleFilter({ member })}
            />
            <Switch checked={filter.spectator}
              unCheckedChildren='Ex-Officios' checkedChildren='Ex-Officios'
              onChange={spectator => this.handleFilter({ spectator })}
            />
            <p><em>Note: If you cast a vote, it won't automatically update these totals (hit refresh in the top right).</em></p>
            <Row type='flex' justify='space-around' align='middle'>
              <Col span={24} lg={8}>
                <h2>Approval Rating</h2>
                <Progress type='circle' width={200}
                  percent={(pass / (pass + fail)) * 100}
                  format={percent => <span>
                    {!Number.isNaN(percent) ? `${parseInt(percent)}%` : <small>Undetermined</small>}
                    <br />
                    <h6>{`${pass} for, ${fail} against`}</h6>
                  </span>
                  }
                />
              </Col>
              <Col span={24} lg={16}>
                <h2>Review Breakdown</h2>
                <Table dataSource={dataSource} pagination={false}
                  rowKey={record => record.prompt}
                  columns={columns}
                />
              </Col>
            </Row>
          </div>
          }
      </section>
    )
  }
}

export default Scores
