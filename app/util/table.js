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
    const { editable, onChange } = this.props
    if (editable && !nextProps.editable) {
      onChange(this.state.value)
    }
  }
  //  Handle the change in child state, then bubble the event to the parent component.
  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })
  }
  render (
    { handleChange } = this,
    { value } = this.state,
    { editable } = this.props
  ) {
    return (
      <div>
        {editable
          ? <Input value={value} onChange={handleChange} />
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
      column.render = (text, record) =>
        this.renderColumn(text, record, columns[i].dataIndex)
    })
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
      if (d._key === record._key) d._editable = !record._editable
    }
  }
  //  Handlechange identifies the prop (dataIndex) modified in a col, updates the data val.
  handleChange (dataIndex, key, value) {
    let { data } = this.state
    for (let d of data) {
      if (d._key === key) d[dataIndex] = value
    }
  }
  //  Handlesubmit scrubs out _key and _editable when submitting to parent.
  handleSubmit = () => {
    console.log('Table handleSubmit')
    let normalizedData = this.state.data.slice()
    normalizedData[0] = undefined
    console.log('submit in table', this.state.data, normalizedData)
    // let { data } = this.state
    // console.log('HAndlesubmit for ', this.state.data)
    // let normalizedData = this.state.data.slice()
    // // //  BUG: Sanitizing data here seems to mutate this.state.data
    // for (let d of normalizedData) {
    //   delete d._editable
    //   delete d._key
    // }
    // this.props.onSubmit(normalizedData)
  }
  footer = () => (
    <div>
      <p>
        <em>Double click a row to edit it.</em>
      </p>
      <Button size='large' type='primary' onClick={this.handleSubmit}>Update</Button>
    </div>
  )
  render (
    { columns, toggleRowEditing, handleSubmit, footer } = this,
    { data } = this.state
  ) {
    return <Table bordered footer={footer}
      dataSource={data}
      columns={columns}
      onRowDoubleClick={toggleRowEditing}
    />
  }
}
EditableTable.PropTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  onSubmit: PropTypes.function
}
export default EditableTable
