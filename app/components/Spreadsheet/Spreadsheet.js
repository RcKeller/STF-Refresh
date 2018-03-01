import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Button, Icon } from 'antd'
import ReactDataSheet from 'react-datasheet'

class FinancialSpreadsheet extends React.Component {
  static propTypes = {
    //  Your dataset is never mutated and can even be ref'd.
    data: PropTypes.array.isRequired,
    //  onSubmit is your callback for receiving well formed data.
    onSubmit: PropTypes.func.isRequired,
    //  Prompt will override the default submit button text (which is "Save")
    prompt: PropTypes.string,
    /*
    NOTE: THE FOLLOWING PROPTYPES WILL BE DEPRECIATED
    */
    //  Column config api is preserved, but editable is REQUIRED
    columns: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.node,
      key: PropTypes.string,
      editable: PropTypes.bool,
      editor: PropTypes.func,
      width: PropTypes.number
    })),
    //  NewData is a prop representing what a brand new field / row should be like (defaults).
    newData: PropTypes.object,
    //  Financial will calculate and show subtotals as necessary
    financial: PropTypes.bool,
    //  Initial total, disposed of once rows update.
    total: PropTypes.number
  }
  header = [
    { value: 'Name', readOnly: true, width: '20%' },
    { value: 'Description / Vendor', readOnly: true, width: '50%' },
    { value: 'Price', readOnly: true, width: '10%' },
    { value: 'Tax', readOnly: true, width: '5%' },
    { value: 'Quantity', readOnly: true, width: '5%' },
    { value: 'Total', readOnly: true, width: '10%' }
  ]
  // Note: Be sure to slice() this value when used to prevent mutability
  newRow = [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, { _id: '', value: '', readOnly: true }]
  footer = [{value: '', readOnly: true, colSpan: 5}, {value: 0, readOnly: true}]
  constructor (props) {
    super(props)
    const { data } = props

    let grid = this.serializeManifest(data)
    const previousChanges = undefined
    this.state = { grid, previousChanges }
  }
  componentDidMount () {
    this.onCellsChanged()
  }
  componentWillReceiveProps (nextProps) {
    const { data } = nextProps
    let grid = this.serializeManifest(data)
    this.setState({ grid, previousChanges: undefined })
    this.onCellsChanged()
  }

  /*
  serializeManifest:
  Denormalizes items from a manifest to confirm to react-datasheet's data scheme
  Scheme has records that are like [ {value}, {value}, {value}]...
  The final cell is a "summary" cell containing subtotals and item _ids for future ref
  */
  serializeManifest = (manifest) => {
    let data = []
    for (let item of manifest) {
      const { _id, name, price, tax, description, quantity } = item || {}
      //  Create a record in the order of headers
      const record = [name, description, price, tax, quantity]
        .map(value => ({ value }))
      // Push our "summary" cell, containing subtotals and the _id
      record.push({ _id, value: 0, readOnly: true })
      data.push(record)
    }
    //  Add Header / footer
    data.unshift(this.header)
    data.push(this.footer)
    return data
  }
  deserializeManifest = (data) => {
    const rows = data.slice(1, data.length - 1)
    let items = rows
      .map(row => {
        const summaryCell = row.length - 1
        const [name, description, price, tax, quantity] = row.map(cell => cell.value)
        const { _id } = row[summaryCell]
        return { _id, name, description, price, tax, quantity }
      })
      .filter(item => item.name && item.price >= 0 && item.quantity >= 0)
    return items
  }
  handleSubmit = () => {
    const { onSubmit } = this.props
    let { grid } = this.state
    const data = this.deserializeManifest(grid)
    console.log('DATA TO SUBMIT', data)
    onSubmit(data)
  }

  /*
  onCellsChanged:
  - Applies changes to the grid
  - Deletes rows of 0 quantity
  - Ensures that there is always 1 new row
  - (Re)Calculates subtotals / grand total
  - Curries _id / uuid prop to final col of records  -
  */
  onCellsChanged = (changes = []) => {
    /*
    MAJOR BUG: onCellsChanged fires twice,
    which makes changes play over a grid twice
    PATCH: Cache the last change request in parent state
    We only proceed with changes that are new
    */
    let { grid, previousChanges } = this.state
    if (!_.isEqual(changes, previousChanges)) {
      const grid = this.state.grid.slice()
      let grandTotal = 0
      /*
      TASK: Apply changes to the grid (immutably using slice())
      */
      for (let change of changes) {
        const { row, col, value } = change
        grid[row][col] = {...grid[row][col], value}
      }
      // SLICE A COPY OF INNER ROWS
      let data = grid
        .slice(1, grid.length - 1)
        // Filter rows that have data (discards 0 quantity items)
        .filter(row => row[4] && row[4].value >= 1)
        // Denormalize per datasheet interface
        .map(row => {
          const summaryCell = row.length - 1
          const [name, description, price, tax, quantity] = row
            .map(cell => cell.value)
          const { _id } = row[summaryCell] || ''
          const value = parseFloat(
            (tax
              ? ((price * quantity) * ((tax / 100) + 1))
              : price * quantity
            ).toFixed(2)
          )
          // Curry _id props, save totals
          row[summaryCell] = { _id, value, readOnly: true }
          grandTotal += (value || 0)
          return row
        })

      //  Prepend header
      data.unshift(this.header)
      //  Add new row (copy of a newRow)
      data.push(this.newRow.slice())
      // Append Footer with grand total
      let footer = this.footer
      footer[1].value = grandTotal
      data.push(footer)
      this.setState({ grid: data, previousChanges: changes })
    }
  }
  render (
    { prompt, disabled } = this.props
  ) {
    let data = this.state.grid
    return (
      <div style={{ width: '100%', marginTop: 8 }}>
        <small><em>Editable Datasheet - Please complete as accurately as you can. Rows are automatically added and removed based on item quantity.</em></small>
        <ReactDataSheet
          data={data}
          valueRenderer={(cell) => (cell.value || '').toString()}
          onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
          onCellsChanged={this.onCellsChanged}
        />
        <Button
          disabled={disabled}
          onClick={this.handleSubmit}
          type='primary' size='small' ghost
          style={{ width: '100%', borderRadius: 'unset', borderTop: 'none' }}
        >
          <span>
            {prompt || 'Submit'}
            {!disabled && <Icon style={{ marginLeft: 8 }} type='cloud-upload-o' />}
          </span>
        </Button>
        <small><span id='foot-1'>[1]</span> <i>A few groups on campus have tax exemption issued via certification from the UW, including a few research groups, and The Daily newspaper. If you have this exemption, you should already be aware of it, and do not need to add tax on your requested items.</i></small>
      </div>
    )
  }
}

export default FinancialSpreadsheet
