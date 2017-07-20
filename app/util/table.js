import React from 'react'
import PropTypes from 'prop-types'

import { Table, Input, Button } from 'antd'

class EditableCell extends React.Component {
  constructor (props) {
    super(props)
    const { value } = this.props
    this.state = { value }
  }
  componentWillReceiveProps (nextProps) {
    // console.log('EDITOR RECEIVED PROPS:', this.props, nextProps)
    //  Editing enabled - cache your data!
    if (!this.props.editable && nextProps.editable) {
      console.log('Editing has been enabled!', nextProps)
    }
    //  Editing disabled - update data via callback and clear cache.
    if (this.props.editable && !nextProps.editable) {
      console.log('Editing is going away!', nextProps)
    }
  }
  render (
    { value } = this.state,
    { editable } = this.props
  ) {
    return (
      <div>
        {editable
          ? <span>EDITING:{value}</span>
          : <span>{value}</span>
        }
      </div>
    )
  }
}
EditableCell.PropTypes = {
  value: PropTypes.string,  //  casting?
  editable: PropTypes.bool,
  handleUpdate: PropTypes.function
}

class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    let { columns, dataSource } = this.props
    //  Add unique keys to your data. These serve as unique identifiers.
    //  Then set editing to false. Double clicking activates a callback, inverting this value.
    for (let i = 0; i < dataSource.length; i++) {
      dataSource[i]._key = i
      dataSource[i]._editable = false
    }
    //  Apply custom renderers that enable data editing.
    for (let column of columns) {
      column.render = (text, record, index) => this.renderColumn(text, record, index)
    }
    this.columns = columns
    this.state = { data: dataSource }
  }
  renderColumn (text, record, index) {
    // console.log('text/record/index', text, record, index)
    // console.log('Editable?', record._editable)
    const { _editable, _key } = record
    return <EditableCell editable={_editable} value={text} />
  }
  toggleRowEditing = (record, index, event) => {
    // console.log('TOGGLE', record, index, event)
    // console.log('Key to row:', record._key)
    let { data } = this.state
    data[index]._editable = !data[index]._editable
    this.setState({ data })
  }
  render (
    { columns, toggleRowEditing } = this,
    { data } = this.state,
    { onSubmit } = this.props
  ) {
    return (
      <div>
        <Table bordered
          dataSource={data}
          columns={columns}
          onRowDoubleClick={this.toggleRowEditing}
        />
        <Button size='large' type='primary' onClick={() => onSubmit(data)}>
          Update
        </Button>
      </div>
    )
  }
}
EditableTable.PropTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  onSubmit: PropTypes.function
}
export default EditableTable
