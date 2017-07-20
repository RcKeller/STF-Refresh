import React from 'react'
import PropTypes from 'prop-types'

import { Table, Input, Button, Popconfirm } from 'antd'

class EditableCell extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.value,
      editable: this.props.editable || false
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable })
      if (nextProps.editable) {
        this.cacheValue = this.state.value
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value)
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue })
        this.props.onChange(this.cacheValue)
      }
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value
  }
  handleChange (e) {
    const value = e.target.value
    this.setState({ value })
  }
  render () {
    const { value, editable } = this.state
    return (
      <div>
        {editable
            ? <div>
              <Input
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            : <div className='editable-row-text'>
              {value.toString() || ' '}
            </div>
        }
      </div>
    )
  }
}

EditableCell.propTypes = {
  value: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.function,
  status: PropTypes.string
}

class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    //  Get column configs and initial data from porps
    //  Columns will have custom renderers that manage editing based on the "editable" prop
    let { columns, dataSource } = this.props
    //  Apply custom renderers that enable data editing.
    for (let i = 0; i < columns.length; i++) {
      columns[i].render = (text, record, index) => this.renderColumns(this.state.data, index, columns[i].title, text)
    }
    //  Add the editor column, allowing you to modify data.
    columns.push({
      title: 'Modify',
      dataIndex: 'modify',
      width: 150,
      render: (text, record, index) => {
        const { editable } = this.state.data[index].name
        return (
          <div className='editable-row-operations'>
            {editable
              ? <span>
                <a onClick={() => this.editDone(index, 'save')}>Save</a>
                <Popconfirm title='Sure to cancel?' onConfirm={() => this.editDone(index, 'cancel')}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
              : <span>
                <a onClick={() => this.edit(index)}>Edit</a>
              </span>
            }
          </div>
        )
      }
    })
    /*
    Denormalizing source data
    We add a unique key and abstract out the values for each field, adding props for editor status.
    These are stripped away when render executes.
    E.G: { name: 'King Snowden' } becomes: {
    key: '7',
    name: {
      editable: false,
      value: 'King Snowden'
    },
    ...}
    */
    let i = 0
    for (let record of dataSource) {
      console.log('r', record)
      Object.keys(record).forEach((key, i) => {
        let value = record[key]
        console.log(record, key, value)
        record[key] = { value, editable: false }
      })
      record.key = i
      i++
    }
    console.log('Finished', dataSource)
    //  Final assignments = set columns and initial data.
    this.columns = columns
    this.state = { data: dataSource }
  }
  renderColumns (data, index, key, text) {
    console.log('RENDERING COLUMNS WITH VALUES:', data, index, key, text)
    const { editable, status } = data[index][key]
    if (typeof editable === 'undefined') {
      return text
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => this.handleChange(key, index, value)}
      status={status}
    />)
  }
  handleChange (key, index, value) {
    const { data } = this.state
    data[index][key].value = value
    this.setState({ data })
  }
  edit (index) {
    const { data } = this.state
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true
      }
    })
    this.setState({ data })
  }
  editDone (index, type) {
    const { data } = this.state
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false
        data[index][item].status = type
      }
    })
    this.setState({ data }, () => {
      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status
        }
      })
    })
  }
  render (
    { columns } = this,
    { data } = this.state,
    { onSubmit } = this.props
  ) {
    //  Remove table configs ("editable", etc) from data source
    const dataSource = data.map((item) => {
      const obj = {}
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value
      })
      return obj
    })
    return (
      <div>
        <Table bordered
          dataSource={dataSource}
          columns={columns}
        />
        <Button size='large' type='primary' onClick={() => onSubmit(dataSource)}>
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
