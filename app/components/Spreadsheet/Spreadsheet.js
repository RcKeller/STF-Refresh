import React from 'react'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
import { Button, Icon } from 'antd'
const { Group } = Button

import { Toolbar, Data } from 'react-data-grid-addons'
const Selectors = Data.Selectors
// import { Editors, Formatters } from 'react-data-grid-addons'
// const { DropDownEditor } = Editors
// const { DropDownFormatter } = Formatters

import { SimpleText } from './Editors'

class SpreadSheet extends React.Component {
  constructor (props) {
    super(props)
    const { columns, data } = this.props
    this.columns = columns
    for (let col of columns) {
      col.resizable = true
      col.sortable = true
      col.filterable = true
    }
    this.state = ({ rows: data,
      filters: {},
      sortColumn: null,
      sortDirection: null
    })
  }

  rowGetter = (i) =>
    this.state.rows[i]

  getRows () {
    return Selectors.getRows(this.state)
  }

  getSize () {
    return this.getRows().length
  }

  rowGetter (rowIdx) {
    const rows = this.getRows()
    return rows[rowIdx]
  }

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    // console.log('handleGridRowsUpdated')
    let rows = this.state.rows.slice()
    // let { rows } = this.state.rows

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i]
      // console.log('ARGS', fromRow, toRow, updated)
      // console.log('rowToUpdate', rowToUpdate)
      let updatedRow = Object.assign(rowToUpdate, updated)
      // let updatedRow = React.addons.update(rowToUpdate, {$merge: updated})
      // rows[i] = updatedRow
    }
    this.setState({ rows })
  }
  handleGridSort = (sortColumn, sortDirection) => {
    this.setState({ sortColumn, sortDirection })
  }
  handleFilterChange = (filter) => {
    let filters = Object.assign({}, this.state.filters)
    if (filter.filterTerm) {
      filters[filter.column.key] = filter
    } else {
      delete filters[filter.column.key]
    }

    this.setState({ filters })
  }

  onClearFilters = () => {
    this.setState({ filters: {} })
  }
  handleSubmit = () => {
    let { rows } = this.state
    const { onSubmit } = this.props
    onSubmit(rows)
  }

  render (
    { rowGetter, handleGridRowsUpdated, handleSubmit } = this,
    { columns } = this.props,
    { rows: { length } } = this.state
) {
    return <div>
      <ReactDataGrid
        enableCellSelect cellNavigationMode='changeRow'
        // minHeight={500}
        columns={columns}
        // rowGetter={rowGetter}
        // rowsCount={length}
        rowGetter={this.rowGetter}
        rowsCount={this.getSize()}
        onGridRowsUpdated={handleGridRowsUpdated}
        toolbar={<Toolbar enableFilter />}
        onGridSort={this.handleGridSort}
        onAddFilter={this.handleFilterChange}
        onClearFilters={this.onClearFilters}
      />
      <Group size='large'>
        {/* <Button size='large' type='primary' ghost onClick={toggleEditAll}>
          <Icon type='edit' />Toggle Editing
        </Button>
        <Button size='large' type='primary' ghost onClick={addRow}>
          <Icon type='plus-circle-o' />Add Row
        </Button> */}
        <Button size='large' type='primary' ghost onClick={handleSubmit}>
          <Icon type='upload' />Save
        </Button>
      </Group>
    </div>
  }
}

export default SpreadSheet
