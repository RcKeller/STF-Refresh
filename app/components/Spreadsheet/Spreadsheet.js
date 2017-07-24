import React from 'react'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
import { Button, Icon } from 'antd'
const { Group } = Button

import Menu from './Menu'

class SpreadSheet extends React.Component {
  constructor (props) {
    super(props)
    const { columns, data } = this.props
    this.columns = columns
    for (let col of columns) {
      col.resizable = true
    }
    this.state = ({ rows: data })
  }

  rowGetter = (i) =>
    this.state.rows[i]

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let { rows } = this.state
    for (let i = fromRow; i <= toRow; i++) {
      Object.assign(rows[i], updated)
    }
    this.setState({ rows })
  }

  deleteRow = (e, { rowIdx }) => {
    let { rows } = this.state
    rows.splice(rowIdx, 1)
    this.setState({rows})
  }
  insertRow = (rowIdx) => {
    let { rows } = this.state
    const newRow = {}
    rows.splice(rowIdx, 0, newRow)
    this.setState({ rows })
  }
  insertRowAbove = (e, { rowIdx }) =>
    this.insertRow(rowIdx)
  insertRowBelow = (e, { rowIdx }) =>
    this.insertRow(++rowIdx)

  handleSubmit = () => {
    let { rows } = this.state
    const { onSubmit } = this.props
    onSubmit(rows)
  }

  render (
    { rowGetter, handleGridRowsUpdated, handleAddRow, handleSubmit } = this,
    { columns } = this.props,
    { rows: { length } } = this.state
) {
    return <div>
      <ReactDataGrid
        enableCellSelect cellNavigationMode='changeRow'
        contextMenu={<Menu
          onRowDelete={this.deleteRow}
          onRowInsertAbove={this.insertRowAbove}
          onRowInsertBelow={this.insertRowBelow}
        />}
        columns={columns}
        rowGetter={rowGetter}
        rowsCount={length}
        onGridRowsUpdated={handleGridRowsUpdated}
      />
      <Group size='large'>
        <Button size='large' type='primary' ghost onClick={handleSubmit}>
          <Icon type='upload' />Save
        </Button>
      </Group>
    </div>
  }
}

SpreadSheet.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.node.isRequired,
    key: PropTypes.string.isRequired,
    editable: PropTypes.bool.isRequired,
    editor: PropTypes.func,
    width: PropTypes.number
  })).isRequired,
  data: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default SpreadSheet
