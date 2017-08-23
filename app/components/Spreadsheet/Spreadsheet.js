import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ReactDataGrid from 'react-data-grid'
import { Alert, Button, Icon } from 'antd'

import Menu from './Menu'

const jss = {
  alert: { padding: 8 },
  button: { width: '100%', borderRadius: '0 0 inherit inherit' }
}
class SpreadSheet extends React.Component {
  constructor (props) {
    super(props)
    const { columns, data, newData } = this.props
    this.columns = columns
    for (let col of columns) {
      col.resizable = true
    }
    let rows = data || []
    if (rows.length < 1) rows[0] = {...newData} || {}
    this.state = ({ rows })
  }
  componentWillReceiveProps (nextProps) {
    //  FIXME: For some reason, this check is failing to work properly. Causes data tables to refresh when forms of parents are changed.
    if (!_.isEqual(nextProps.data === this.props.data)) {
      const { data, newData } = nextProps
      let rows = data || []
      if (rows.length < 1) rows[0] = {...newData} || {}
      this.state = ({ rows })
    }
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
    let { newData } = this.props
    let newRow = {...newData} || {}
    rows.splice(rowIdx, 0, newRow)
    this.setState({ rows })
  }
  insertRowAbove = (e, { rowIdx }) => this.insertRow(rowIdx)
  insertRowBelow = (e, { rowIdx }) => this.insertRow(++rowIdx)

  handleSubmit = () => {
    let { rows } = this.state
    const { onSubmit } = this.props
    onSubmit(rows)
  }

  render (
    // { rowGetter, handleGridRowsUpdated, handleAddRow, handleSubmit } = this,
    { columns, disable } = this.props,
    { rows } = this.state || {}
) {
    if (rows && Number.isInteger(rows.length) && rows.length < 1) {
      this.insertRow(0)
    }
    return <div>
      <Alert type='warning' banner showIcon={false} closable
        style={jss.alert}
        message='Excel Datatable'
        description='This table can be edited! Remember to save your data when you are done'
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
      <Button size='large' type='primary' disabled={disable} style={jss.button} onClick={this.handleSubmit}>
        <Icon type='upload' />Save
      </Button>
    </div>
  }
}

SpreadSheet.propTypes = {
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
  onSubmit: PropTypes.func.isRequired
}

export default SpreadSheet
