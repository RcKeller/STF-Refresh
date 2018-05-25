import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Row, Col, Switch, Progress, Table } from 'antd'

import { makeManifestByID } from '../../../../../selectors'
import { Loading } from '../../../../../components'

const metricsColumns = [
  { title: 'Prompt', dataIndex: 'prompt', key: 'prompt' },
  { title: 'Score', dataIndex: 'score', key: 'score', width: 60 }
]
const remarksColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 100 },
  { title: 'Remarks', dataIndex: 'body', key: 'body' }
]

const float = (num) => Number.parseFloat((num || 0).toFixed(2))
/*
SCORES PANEL:
Shows a breakdown of scores post-QA
Allows you to also filter by role
(Implemented so we could keep admins engaged in the
proposal deliberation process - why exclude them?)
NOTE: This does not refresh automagically! No web sockets
*/
@connect(
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      const { reviews } = manifest
      return {
        manifest,
        reviews,
        user: state.user
      }
    }
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
    let remarks = []
    let metrics = []
    if (manifest.reviews && manifest.reviews.length > 0) {
      //  FILTER REVIEWS BY ROLE
      //  All reviews, filtered and sorted by type (will have duplicates across keys, STF members have many roles)
      const reviews = {
        admin: manifest.reviews.filter(rev => filter.admin && rev.author.stf && rev.author.stf.admin === true),
        member: manifest.reviews.filter(rev => filter.member && rev.author.stf && rev.author.stf.member === true),
        spectator: manifest.reviews.filter(rev => filter.spectator && rev.author.stf && rev.author.stf.spectator === true)
      }
      //  Create a set (array w/ unique values) by spreading all the review types we've filtered
      //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
      //  https://gist.github.com/telekosmos/3b62a31a5c43f40849bb#gistcomment-1830283
      const filteredReviews = [...new Set([
        ...reviews.admin,
        ...reviews.member,
        ...reviews.spectator
      ])]

      //  CALCULATE AVERAGE SCORES
      metrics = filteredReviews.reduce((total, votes) => {
        //  Assign approvals, accounting for null/undef
        if (votes.approved === true) pass++
        if (votes.approved === false) fail++
        // console.log('VOTES', votes)
        if (votes.body && votes.author.name) {
          const { body, author: { name } } = votes
          remarks.push({ body, name })
        }
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
    return { pass, fail, metrics, remarks }
  }
  render (
    { form, manifest, user } = this.props,
    { filter } = this.state
  ) {
    const { pass, fail, metrics, remarks } = this.filterReviews()
    const metricsData = Object.keys(metrics).map(key => {
      return { prompt: key, score: float(metrics[key]) }
    })
    const averageMetric = metricsData.reduce(
      (accumulator, metric) => accumulator + (metric.score || 0),
      0
    ) / (metricsData.length || 1)
    return (
      <section>
        <Loading render={manifest} title='Scores Panel'>
          <div>
            <h4>Filter by Commitee Roles</h4>
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
            <p><em>Note: If you cast a vote, it won't automatically update these totals (hit the refresh button at the top right).</em></p>
            <Row type='flex' justify='space-between' align='middle'>
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
                <h2>Scores</h2>
                <Table dataSource={metricsData} pagination={false}
                  size='middle'
                  rowKey={record => record.prompt}
                  columns={metricsColumns}
                  footer={() => <h2>
                    Average Score:
                    <span style={{ float: 'right', padding: '0 16px' }}>{float(averageMetric)}</span>
                  </h2>
                  }
                />
              </Col>
            </Row>
            <h2>Committee Remarks</h2>
            {remarks &&
              <Table dataSource={remarks} pagination={false}
                size='middle'
                rowKey={record => record.name}
                columns={remarksColumns}
              />
            }
          </div>
        </Loading>
      </section>
    )
  }
}

export default Scores
