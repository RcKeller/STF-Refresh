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
    //  Editing disabled - update data via callback and clear cache.
    if (this.props.editable && !nextProps.editable) {
      this.props.onChange(this.state.value)
    }
  }
  //  Handle the change in child state, then bubble the event to the parent component.
  handleChange (e) {
    const value = e.target.value
    this.setState({ value })
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
    columns.forEach((column, i) => {
      //  Include the data index of the column - this is the prop associated with the data obj
      column.render = (text, record) => this.renderColumn(text, record, columns[i].dataIndex)
    })

    //  TODO: Remove (This is for debugging)
    dataSource.splice(2, 1)
    this.columns = columns
    this.state = { data: dataSource }
  }
  //  RenderColumn passes cell data and callbacks to display elements.
  renderColumn (text, record, dataIndex) {
    const { _editable, _key } = record
    return <EditableCell
      editable={_editable} value={text}
      onChange={value => this.handleChange(dataIndex, _key, value)}
    />
  }
  //  ToggleRow finds the record with the specified key and sets it to editable.
  toggleRowEditing = (record) => {
    let { data } = this.state
    for (let d of data) {
      if (d._key === record._key) {
        d._editable = !record._editable
      }
    }
    this.setState({ data })
  }
  handleChange (dataIndex, key, value) {
    let { data } = this.state
    for (let d of data) {
      if (d._key === key) {
        d[dataIndex] = value
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
