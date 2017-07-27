import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { message } from 'antd'
import api from '../../../../services'

import SpreadSheet, { Editors } from '../../../../components/SpreadSheet'
const { SimpleNumber } = Editors

const columns = [{
  name: 'Name',
  key: 'name',
  editable: true,
  width: 300
}, {
  name: 'Description',
  key: 'description',
  editable: true
  //  Takes up remaining width.
}, {
  name: 'Quantity',
  key: 'quantity',
  editable: true,
  editor: SimpleNumber,
  width: 85
}, {
  name: 'Price',
  key: 'price',
  editable: true,
  editor: SimpleNumber,
  width: 85
}, {
  name: 'Tax',
  key: 'tax',
  editable: true,
  editor: SimpleNumber,
  width: 85
}, {
  name: 'Priority',
  key: 'priority',
  editable: true,
  editor: SimpleNumber,
  width: 85
}]

//  TODO: Testing with http://localhost:3000/edit/596e8a522465c05140e07d8f
@connect(
  state => ({
    parent: state.db.proposal._id,
    manifest: state.db.proposal.manifests[0]
  }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Manifest extends React.Component {
  handleSubmit = (items) => {
    console.log('HANDLE SUBMIT', items)
    let { api, parent, manifest } = this.props
    // let items = Object.values(values)
    // console.log(items)
    const id = manifest._id
    const update = {  //  Replace publication status only.
      proposal: (prev, next) =>
        next && next.manifests
        ? Object.assign(prev, { manifests: next.manifests })
        : prev
    }
    // console.log(manifest)
    manifest
    ? api.patch('manifest', {
      proposal: parent,
      type: 'original',
      items
    }, { id, update })
    // }, { id: manifest._id })
    : api.post('manifest', {
      proposal: parent,
      type: 'original',
      items
    }, { update }
  )
    .then(message.success(`Updated budget manifest!`))
    .catch(err => {
      message.warning(`Failed to update budget manifest - Unexpected client error`)
      console.warn(err)
    })
  }
  render ({ manifest } = this.props) {
    console.log('LOADED MANIFEST', manifest)
    return (
      <div>
        <p>Enter your budget requirements here. Tax MUST be included and will automatically default at 10.1% (Seattle's tax rate)</p>
        <SpreadSheet
          columns={columns}
          data={manifest ? manifest.items : []}
          // data={testData}
          newData={{tax: 10.1}}
          onSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}
Manifest.propTypes = {
  api: PropTypes.object,
  parent: PropTypes.string,
  manifest: PropTypes.object
}
export default Manifest
