import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Button, Icon, Alert } from 'antd'
import ReactDataSheet from 'react-datasheet'

class Spreadsheet extends React.Component {
  static propTypes = {
    // Data: an array of items
    data: PropTypes.array.isRequired,
    //  onSubmit is your callback for receiving well formed data.
    onSubmit: PropTypes.func.isRequired,
    //  Prompt will override the default submit button text (which is "Save")
    prompt: PropTypes.string
    /*
    Several proptypes have been depreciated for this component
    During the React 16 migration, we left react-data-grid for a
    component that did not rely on DOM manipulation so much (buggy)
    if troubleshooting, view git history carefully
    */
  }
  static defaultProps = {
    data: [],
    prompt: 'Submit'
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
  newRow = [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, { _id: '', value: 0, readOnly: true }]
  footer = [{value: '', readOnly: true, colSpan: 5}, {value: 0, readOnly: true}]
  constructor (props) {
    super(props)
    let { data } = props
    if (data.length < 1) data = [{ name: 'Some item', description: 'About the item', price: 350, tax: 10.1, quantity: 1 }]

    let grid = this.serializeManifest(data)
    const previousChanges = undefined
    const warnings = []
    this.state = { grid, previousChanges, warnings }
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
  // shouldComponentUpdate (nextProps) {
  //   return (!_.isEqual(this.props, nextProps))
  // }

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
      //  Record grand total and warnings to throw as we iterate...
      let grandTotal = 0
      let warnings = []
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
        // .filter(row => row[4] && row[4].value >= 1)
        // Filter out rows without ANY data (user deleted it all)
        .filter((row, i) => {
          const values = row.filter(cell => cell.value)
          return values.length > 0
        })
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

      //  Check for errors with data, record verbose tips on how to fix them
      for (let [i, row] of Array.entries(data)) {
        const values = row.filter(cell => cell.value)
        // Warn about incomplete rows
        if (values.length >= 1 && values.length < 5) {
          warnings.push(`Row ${i + 1}: Missing ${5 - values.length} fields`)
        // Warn about poor pricing
        } else if (row[5] && Number.isNaN(row[5].value)) {
          warnings.push(`Row ${i + 1}: Pricing Data Insufficient`)
        }
      }

      //  Prepend header
      data.unshift(this.header)
      //  Add new row if the prior row has been filled (copy of a newRow)
      const newRow = this.newRow.slice()
      if (!_.isEqual(data[data.length - 1], newRow)) {
        data.push(newRow)
      }
      // Append Footer with grand total
      let footer = this.footer
      footer[1].value = grandTotal
      data.push(footer)
      this.setState({ grid: data, previousChanges: changes, warnings })
    }
  }
  render (
    { prompt, disabled } = this.props,
    { grid: data, warnings } = this.state
  ) {
    // let data = this.state.grid
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
          disabled={disabled || warnings.length > 0}
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
        {!disabled && warnings.length > 0 &&
          <Alert showIcon banner
            type='warning'
            message={<span>
              {warnings.map((prompt, i) => (
                <li key={i}>{prompt}</li>
              ))}
            </span>}
          />
        }
      </div>
    )
  }
}

export default Spreadsheet
