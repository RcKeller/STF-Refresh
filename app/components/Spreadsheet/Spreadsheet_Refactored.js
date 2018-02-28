import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Button, Icon } from 'antd'
const ButtonGroup = Button.Group

import Instructions from './Instructions'

import ReactDataSheet from 'react-datasheet'

const currency = number => `$${Number.parseInt(number).toLocaleString('en-US')}`

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
  newRow = [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, { _id: '', value: '', readOnly: true }]
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
    const grandTotal = 0
    // console.warn('serializeManifest', grid)
    this.state = { grid, previousChanges, grandTotal }
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
    return data
  }
  deserializeManifest = (data) => {
    let items = data
      .slice()
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
    // let { rows, total } = this.state
    const { onSubmit } = this.props
    let { grid } = this.state
    const data = this.deserializeManifest(grid)
    console.log('DATA TO SUBMIT', data)
    // onSubmit(data)
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
      data.push(this.newRow)
      /*
      TASK: Redefine state to trigger rerender
      */
      this.setState({ grid: data, previousChanges: changes, grandTotal })
    }
  }
  render (
    { prompt, disabled } = this.props,
    { grid, grandTotal } = this.state
  ) {
    return (
      <div style={{ width: '100%', marginTop: 8 }}>
        <small><em>Editable Datasheet - Please complete as accurately as you can. Rows are automatically added and removed based on quantity.</em></small>
        <span className='data-grid-container'>
          <table className='data-grid'>
            <thead>
              <tr>
                <td className='cell read-only' style={{width: '20%'}}>
                  <span className='value-viewer'>Name</span>
                </td>
                <td className='cell read-only' style={{width: '50%'}}>
                  <span className='value-viewer'>Description</span>
                </td>
                <td className='cell read-only' style={{width: '10%'}}>
                  <span className='value-viewer'>Price</span>
                </td>
                <td className='cell read-only' style={{width: '5%'}}>
                  <span className='value-viewer'>Tax</span>
                </td>
                <td className='cell read-only' style={{width: '5%'}}>
                  <span className='value-viewer'>Quantity</span>
                </td>
                <td className='cell read-only' style={{width: '10%'}}>
                  <span className='value-viewer'>Total</span>
                </td>
              </tr>
            </thead>
          </table>
        </span>
        <ReactDataSheet
          ref='datasheet'
          data={grid}
          valueRenderer={(cell) => (cell.value).toString()}
          onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
          onCellsChanged={this.onCellsChanged}
        />
        <span className='data-grid-container'>
          <table className='data-grid'>
            <thead>
              <tr>
                <td className='cell read-only' style={{ width: '90%', border: 'none' }}>
                  <Button
                    disabled={disabled}
                    onClick={this.handleSubmit}
                    type='primary' size='small' ghost
                    style={{ height: '100%', width: '100%', borderRadius: 'unset' }}
                  >
                    <span>
                      {prompt || 'Submit'}
                      <Icon style={{ marginLeft: 8 }} type='cloud-upload-o' />
                    </span>
                  </Button>
                </td>
                <td className='cell read-only' style={{width: '10%'}}>
                  <span className='value-viewer'>{currency(grandTotal)}</span>
                </td>
              </tr>
            </thead>
          </table>
        </span>
        <small><span id='foot-1'>[1]</span> <i>A few groups on campus have tax exemption issued via certification from the UW, including a few research groups, and The Daily newspaper. If you have this exemption, you should already be aware of it, and do not need to add tax on your requested items.</i></small>
      </div>
    )
  }
}

export default FinancialSpreadsheet
