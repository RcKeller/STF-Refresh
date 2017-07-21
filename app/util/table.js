import React from 'react'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
import { Table, Input, InputNumber, Switch, Button, Icon } from 'antd'
const { Group } = Button

const uuidv4 = require('uuid/v4')

class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    this._columns = [
      {
        key: 'id',
        name: 'ID',
        width: 80
      },
      {
        key: 'task',
        name: 'Title',
        editable: true
      },
      {
        key: 'priority',
        name: 'Priority',
        editable: true
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        editable: true
      },
      {
        key: 'complete',
        name: '% Complete',
        editable: true
      },
      {
        key: 'startDate',
        name: 'Start Date',
        editable: true
      },
      {
        key: 'completeDate',
        name: 'Expected Complete',
        editable: true
      }
    ]
    const rows = this.createRows(1000)
    this.state = ({ rows })
    this.getRandomDate = this.getRandomDate.bind(this)
    this.createRows = this.createRows.bind(this)
    this.rowGetter = this.rowGetter.bind(this)
    this.handleGridRowsUpdated = this.rowGetter.bind(this)
  }

  getRandomDate (start, end) {
    console.log('getRandomDate')
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString()
  }

  createRows (numberOfRows) {
    console.log('createRows')
    let rows = []
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        id: i,
        task: `Task ${i}`,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
        issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
        startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
        completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1))
      })
    }
    return rows
  }

  rowGetter (i) {
    console.log('rowGetter')
    return this.state.rows[i]
  }

  handleGridRowsUpdated ({ fromRow, toRow, updated }) {
    console.log('handleGridRowsUpdated')
    let rows = this.state.rows.slice()

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i]
      let updatedRow = React.addons.update(rowToUpdate, {$merge: updated})
      rows[i] = updatedRow
    }

    this.setState({ rows })
  }

  render () {
    return <ReactDataGrid
      enableCellSelect
      columns={this._columns}
      rowGetter={this.rowGetter}
      rowsCount={this.state.rows.length}
      minHeight={500}
      onGridRowsUpdated={this.handleGridRowsUpdated}
    />
  }
}

export default EditableTable
