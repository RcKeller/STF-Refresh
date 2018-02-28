import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Button, Icon } from 'antd'
const ButtonGroup = Button.Group

import Instructions from './Instructions'

import ReactDataSheet from 'react-datasheet'
// // Be sure to include styles at some point, probably during your bootstrapping
// import 'react-datasheet/lib/react-datasheet.css'

// const calculateTotal = (price, quantity, tax = 0) =>
//   (price * quantity) * (100 / tax)

class FinancialSpreadsheet extends React.Component {
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
    //  Prompt will override the default submit button text (which is "Save")
    prompt: PropTypes.string,
    //  Initial total, disposed of once rows update.
    total: PropTypes.number
  }
  // headers = ['Name', 'Description', 'Price', 'Tax', 'Quantity', 'TOTAL']
  header = [
    { value: 'Name', readOnly: true, width: '20%' },
    { value: 'Description / Vendor', readOnly: true, width: '50%' },
    { value: 'Price', readOnly: true, width: '10%' },
    { value: 'Tax', readOnly: true, width: '5%' },
    { value: 'Quantity', readOnly: true, width: '5%' },
    { value: 'Total', readOnly: true, width: '10%' }
  ]
  newRow = [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, { _id: '', value: '', readOnly: true }]
  footer = [{value: '', readOnly: true, colSpan: 5}, {value: 0, readOnly: true}]
  constructor (props) {
    super(props)
    console.error(props)
    const { data, newData } = props
    /*
    serializeManifest:
    Denormalizes items from a manifest to confirm to react-datasheet's data scheme
    Scheme has records that are like [ {value}, {value}, {value}]...
    The final cell is a "summary" cell containing subtotals and item _ids for future ref
    */
    let grid = this.serializeManifest(data)
    const previousChanges = undefined
    // console.warn('serializeManifest', grid)
    this.state = { grid, previousChanges }
  }
  componentDidMount () {
    this.onCellsChanged()
  }
  componentWillReceiveProps (nextProps) {
    const { data } = nextProps
    let grid = this.serializeManifest(data)
    this.state = { grid, previousChanges: undefined }
    this.onCellsChanged()
  }
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
    // console.warn('deserializeManifest - start', data)
    const rows = data.slice(1, data.length - 1)
    // let normalizedData = []
    // for (let row of rows) {
    //   const summaryCell = row.length - 1
    //   const [name, description, price, tax, quantity] = row.map(cell => cell.value)
    //   const { _id } = row[summaryCell]
    //   normalizedData.push({ _id, name, description, price, tax, quantity })
    // }
    let items = rows
      .map(row => {
        const summaryCell = row.length - 1
        const [name, description, price, tax, quantity] = row.map(cell => cell.value)
        const { _id } = row[summaryCell]
        return { _id, name, description, price, tax, quantity }
      })
      .filter(item => item.name && item.price >= 0 && item.quantity >= 0)
    // console.log('deserializeManifest - end', normalizedData)
    return items
  }
  handleSubmit = () => {
    // let { rows, total } = this.state
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
  - Recalculates totals
  -
  */
  onCellsChanged = (changes = []) => {
    /*
    MAJOR BUG: onCellsChanged fires twice,
    which makes changes play over a grid twice
    PATCH: Cache the last change request in parent state
    We only proceed with changes that are new
    */
    if (!_.isEqual(changes, this.state.previousChanges)) {
      let grid = this.state.grid.slice()
      let grandTotal = 0
      /*
      TASK: Apply changes to the grid (immutably using slice())
      */
      for (let change of changes) {
        const { row, col, value } = change
        grid[row][col] = {...grid[row][col], value}
      }
      // let rows = grid.slice(1, grid.length - 1)
      // console.warn('Initial Rows', rows)
      /*
      TASK: Delete rows with 0 quantity
        - Accumulate subtotals
        - Carry over mongo  _id / uuid
      */
      let data = grid
        // SLICE A COPY
        .slice(1, grid.length - 1)
        // FILTER ROWS THAT HAVE DATA
        .filter(row => row[4] && row[4].value >= 1)
        // ACCUMULATE SUBTOTALS / CURRY _ID
        .map(row => {
          const summaryCell = row.length - 1
          const [name, description, price, tax, quantity] = row
            .map(cell => cell.value)
          const { _id } = row[summaryCell]
          const value = parseFloat(
              ((price * quantity) * ((tax / 100) + 1))
              .toFixed(2)
            )
          row[summaryCell] = { _id, value, readOnly: true }
          grandTotal += (value || 0)
          return row
        })
      console.log('DATA', data)
      data.unshift(this.header)
      data.push(this.newRow)
      let footer = this.footer
      footer[1].value = grandTotal
      data.push(footer)
      /*
      TASK: Redefine state to trigger rerender
      */
      this.setState({ grid: data, previousChanges: changes })
    }
  }
  render (
    { prompt, disabled } = this.props
  ) {
    let data = this.state.grid
    return (
      <div style={{ width: '100%', marginTop: 8 }}>
        <small><em>Editable Datasheet - Please complete as accurately as you can. Rows are automatically added and removed based on quantity.</em></small>
        <ReactDataSheet
          ref='datasheet'
          // data={this.state.grid}
          data={data}
          // valueRenderer={(cell, i) => <span className={this.cellClasses[i]}>{(cell.value).toString()}</span>}
          valueRenderer={(cell) => (cell.value).toString()}
          onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
          onCellsChanged={this.onCellsChanged}
        />
        <Button
          disabled={disabled}
          onClick={this.handleSubmit}
          type='primary' size='small' ghost
          style={{ width: '100%', borderRadius: 'unset' }}
        >
          <span>
            {prompt || 'Submit'}
            <Icon style={{ marginLeft: 8 }} type='cloud-upload-o' />
          </span>
        </Button>
        <small><span id='foot-1'>[1]</span> <i>A few groups on campus have tax exemption issued via certification from the UW, including a few research groups, and The Daily newspaper. If you have this exemption, you should already be aware of it, and do not need to add tax on your requested items.</i></small>
      </div>
    )
  }
}

export default FinancialSpreadsheet
