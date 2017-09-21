import React from 'react'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
import { Alert, Button, Icon } from 'antd'

import Menu from './Menu'

class Spreadsheet extends React.Component {
  static propTypes = {
    //  Column config api is preserved, but editable is REQUIRED
    columns: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.node.isRequired,
      key: PropTypes.string.isRequired,
      editable: PropTypes.bool.isRequired,
      editor: PropTypes.func,
      width: PropTypes.number
    })).isRequired,
    //  Your dataset is never mutated and can even be ref'd.
    data: PropTypes.array.isRequired,
    //  NewData is a prop representing what a brand new field / row should be like (defaults).
    newData: PropTypes.object,
    //  onSubmit is your callback for receiving well formed data.
    onSubmit: PropTypes.func.isRequired,
    //  Financial will calculate and show subtotals as necessary
    financial: PropTypes.bool,
    //  Initial total, disposed of once rows update.
    total: PropTypes.number
  }
  constructor (props) {
    super(props)
    const { columns, data, newData, financial, total } = this.props
    this.columns = columns
    for (let col of columns) {
      col.resizable = true
    }
    let rows = data || []
    if (rows.length < 1) rows[0] = {...newData} || {}
    let state = { rows }
    //  If this is a financial Spreadsheet, initialize total
    if (financial) state.total = total || 0
    this.state = state
  }
  componentWillReceiveProps (nextProps) {
    //  NOTE: Fixed a bug here with prop updates, check later for future enhancement.
    const { data } = nextProps
    if (Array.isArray(data) && data.length >= 1) {
      let rows = data || []
      this.setState({ rows })
    }
  }
  rowGetter = (i) =>
    this.state.rows[i]

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let { rows } = this.state
    const { financial, columns } = this.props
    for (let i = fromRow; i <= toRow; i++) {
      Object.assign(rows[i], updated)
    }
    //  For financial sheets, update subtotal. Check cols passed in to see if we need to calc tax too.
    //  We do this because reporting may include tax data.
    let state = { rows }
    const recordsWithTax = columns.filter(col => col.key === 'tax').length > 0
    if (financial) {
      let total = 0
      for (const record of rows) {
        const cost = recordsWithTax
          //  Tax isn't stored as a float, making that adjustment here.
          ? record.price * record.quantity * (record.tax / 100 + 1)
          : record.price * record.quantity
        if (!Number.isNaN(cost)) total += cost
      }
      state.total = total
    }
    this.setState(state)
  }

  deleteRow = (e, { rowIdx }) => {
    let { rows } = this.state
    rows.splice(rowIdx, 1)
    this.setState({rows})
  }
  insertRow = (rowIdx) => {
    let { rows } = this.state
    let { newData } = this.props
    let newRow = {...newData} || {}
    rows.splice(rowIdx, 0, newRow)
    this.setState({ rows })
  }
  insertRowAbove = (e, { rowIdx }) => this.insertRow(rowIdx)
  insertRowBelow = (e, { rowIdx }) => this.insertRow(++rowIdx)

  handleSubmit = () => {
    let { rows, total } = this.state
    const { onSubmit } = this.props
    onSubmit(rows, total)
  }

  render (
    // { rowGetter, handleGridRowsUpdated, handleAddRow, handleSubmit } = this,
    { columns, financial, disabled } = this.props,
    { rows, total } = this.state || {}
) {
    if (rows && Number.isInteger(rows.length) && rows.length < 1) {
      this.insertRow(0)
    }
    const currency = number => number.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    return <div>
      {/* <Alert type='warning' banner showIcon={false} closable
        message='This table can be edited! Remember to save your data when you are done'
        /> */}
      <Alert type='info' showIcon={false} banner closable
        message={<span>
          <h5>Editable Spreadsheet:</h5>
          <hr />
          <ul>
            <li>
              <b>Edit Data: </b> Press enter to edit, or start typing to overwrite.
            </li>
            <li>
              <b>Add /Delete Rows: </b> Right click the table and choose add/delete.
            </li>
            <hr />
            {financial && <li>Totals are calculated automatically, including tax<br /></li>}
            <li>
              <em><b>Don't forget to save when you are finished!</b></em>
            </li>
          </ul>
        </span>}
       />
      <ReactDataGrid
        enableCellSelect cellNavigationMode='changeRow'
        contextMenu={<Menu
          onRowDelete={this.deleteRow}
          onRowInsertAbove={this.insertRowAbove}
          onRowInsertBelow={this.insertRowBelow}
        />}
        columns={columns}
        rowGetter={this.rowGetter}
        rowsCount={(rows && rows.length) || 0}
        onGridRowsUpdated={this.handleGridRowsUpdated}
      />
      {(financial && total > 0) &&
        <Alert type='info' showIcon={false} banner
          message={<h2>Final Total: {total ? currency(total) : '$0.00'}</h2>}
         />
      }
      <Button size='large' type='primary' disabled={disabled}
        style={{ width: '100%', borderRadius: 'none' }}
        onClick={this.handleSubmit}>
        <Icon type='upload' />Save
      </Button>
    </div>
  }
}

export default Spreadsheet
