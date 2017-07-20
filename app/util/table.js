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
      // console.log('Editing has been enabled!', nextProps)
      //  Update data cache with initial editing state
      this.setState({ value: nextProps.value })
    }
    //  Editing disabled - update data via callback and clear cache.
    if (this.props.editable && !nextProps.editable) {
      // console.log('Editing is going away!', nextProps)
    }
  }
  handleChange (e) {
    const value = e.target.value
    this.setState({ value })
  }
  handleUpdate () {
    let { onUpdate } = this.props
    return 'TEST'
  }
  render (
    { value } = this.state,
    { editable } = this.props
  ) {
    return (
      <div>
        {editable
          ? <Input
            value={value}
            onChange={e => this.handleChange(e)}
          />
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

    //  TODO: Remove (This is for debugging)
    dataSource.splice(2, 1)
    this.columns = columns
    this.state = { data: dataSource }
  }
  //  RenderColumn passes cell data, editor status and callbacks to display elements.
  renderColumn (text, record, index) {
    // console.log('text/record/index', text, record, index)
    // console.log('Editable?', record._editable)
    const { _editable, _key } = record
    // console.log('Key vs index?', _key, index)
    return <EditableCell editable={_editable} value={text} index={index} />
  }
  //  ToggleRow finds the record with the specified key and sets it to editable.
  toggleRowEditing = (record, index, event) => {
    let { data } = this.state
    let key = record._key
    for (let d of data) {
      if (d._key === key) {
        // d = record
        d._editable = !record._editable
      }
    }
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
