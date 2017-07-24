import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Input, InputNumber, Switch, message } from 'antd'
import api from '../../../../services'
// import EditableTable from '../../../../util/table'
import SpreadSheet, { Editors } from '../../../../components/SpreadSheet'
const { SimpleNumber } = Editors
console.log(SimpleNumber)
// console.log(Editors)
// console.log(Editors.SimpleText)

const testData = [{
  '_id': '596e8a522465c05140e07da5',
  'manifest': '596e8a522465c05140e07da0',
  'name': 'e-commerce',
  'description': 'Saepe provident minus. Recusandae nulla qui repudiandae velit voluptatibus consequatur sed facilis. Delectus sed et voluptatem harum consequatur consequatur enim. Nobis cum perspiciatis labore consectetur quia et magnam est. Molestiae cupiditate voluptatem aut eius atque voluptatum.',
  'price': 88964,
  'priority': 46490,
  '__v': 0,
  'tax': 68575,
  'quantity': 43749,
  'purchased': true
}, {
  '_id': '596e8a522465c05140e07da4',
  'manifest': '596e8a522465c05140e07d9f',
  'name': 'infomediaries',
  'description': 'Ex libero et vitae et quia consequuntur. Occaecati consectetur tenetur hic soluta. Et illum sapiente laudantium quia et sit.',
  'price': 36510,
  'priority': 9724,
  '__v': 0,
  'tax': 63233,
  'quantity': 62004,
  'purchased': true
}, {
  '_id': '596e8a522465c05140e07da7',
  'manifest': '596e8a522465c05140e07da2',
  'name': 'synergies',
  'description': 'Nihil qui rerum aut labore. Dolor maiores in molestiae quo quas quis sunt non. Dolor vel alias soluta in quis. Est nam et est. Ad in sit repellat.',
  'price': 19954,
  'priority': 51183,
  '__v': 0,
  'tax': 26719,
  'quantity': 53391,
  'purchased': true
}, {
  '_id': '596e8a522465c05140e07da3',
  'manifest': '596e8a522465c05140e07d9e',
  'name': 'applications',
  'description': 'Ab inventore consequatur. Qui autem voluptate similique. Dignissimos aut ipsam quia rerum.',
  'price': 15577,
  'priority': 58404,
  '__v': 0,
  'tax': 73779,
  'quantity': 84166,
  'purchased': true
}, {
  '_id': '596e8a522465c05140e07da6',
  'manifest': '596e8a522465c05140e07da1',
  'name': 'supply-chains',
  'description': 'Optio neque incidunt perferendis quo reiciendis quaerat. Similique voluptatem debitis. Est voluptas mollitia. Sint provident quibusdam. Qui laborum dolorem explicabo. Incidunt consequatur est mollitia mollitia totam quam.',
  'price': 68196,
  'priority': 1758,
  '__v': 0,
  'tax': 46341,
  'quantity': 35641,
  'purchased': true
},
{}]

const columns = [{
  name: 'Name',
  key: 'name',
  editable: true,
  width: 300
}, {
  name: 'Description',
  key: 'description',
  editable: true
  // width: 400
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
  state => ({ manifest: state.db.proposal.manifests[0] }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Manifest extends React.Component {
  handleSubmit (values) {
    console.log('HANDLE SUBMIT', values)
  }
  render ({ manifest } = this.props) {
    console.log('LOADED MANIFEST', manifest)
    return (
      <div>
        <SpreadSheet
          columns={columns}
          // data={manifest.items}
          data={testData}
          onSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}
Manifest.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  contacts: PropTypes.array,
  user: PropTypes.object
}
export default Manifest
