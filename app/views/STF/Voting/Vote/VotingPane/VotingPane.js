import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Switch, Checkbox, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

@compose(
  connect(
    (state, props) => ({
      manifest: state.db.manifests[props.index],
      review: state.db.manifests[props.index].reviews.filter(review =>
          // review.author._id === state.user._id),
          review.author._id === "5991d88bae3e6f4ad0669bbf")[0] || {},
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class VotingPane extends React.Component {
  // componentDidMount () {
  //   const { form, id, category, organization, budget, uac, status, published } = this.props
  //   if (id) {
  //     form.setFieldsValue({ category, organization, budget, uac, status, published })
  //   }
  // }
  // handleCategory = (category) => {
  //   const { api, id } = this.props
  //   const update = {  //  Replace publication status only.
  //     proposal: (prev, next) =>
  //       Object.assign(prev, { organization: next.category })
  //   }
  //   api.patch('proposal', { category }, { id, update })
  //   .then(message.success(`Updated category: ${category}`), 10)
  //   .catch(err => {
  //     message.warning(`Failed to update - client error`)
  //     console.warn(err)
  //   })
  // }
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
  render (
    { manifest } = this.props,
    { filter } = this.state
  ) {
    //  All reviews, filtered and sorted by type (will have duplicates across keys, STF members have many roles)
    const reviews = {
      admin: manifest.reviews.filter(rev => filter.admin && rev.author.stf.admin === true),
      member: manifest.reviews.filter(rev => filter.member && rev.author.stf.member === true),
      spectator: manifest.reviews.filter(rev => filter.spectator && rev.author.stf.spectator === true)
    }
    console.warn('All reviews', reviews)
    //  Create a set (array w/ unique values) by spreading all the review types we've filtered
    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
    //  https://gist.github.com/telekosmos/3b62a31a5c43f40849bb#gistcomment-1830283
    const summary = [...new Set([
      ...reviews.admin,
      ...reviews.member,
      ...reviews.spectator
    ])]
    console.warn('summary', summary)
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h4>Filter by Commitee Roles</h4>
            <Switch checked={filter.admin}
              unCheckedChildren='Admins' checkedChildren='Admins'
              onChange={admin => this.handleFilter({ admin })} />,
            <Switch checked={filter.member}
              unCheckedChildren='Members' checkedChildren='Members'
              onChange={member => this.handleFilter({ member })} />,
            <Switch checked={filter.spectator}
              unCheckedChildren='Spectators' checkedChildren='Spectators'
              onChange={spectator => this.handleFilter({ spectator })} />,
          </div>
          }
      </section>
    )
  }
}
VotingPane.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  manifest: PropTypes.object,
  user: PropTypes.object
}
export default VotingPane
