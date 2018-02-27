import React from 'react'
import PropTypes from 'prop-types'

// import { Menu } from 'react-data-grid-addons'
// const { ContextMenu, MenuItem, SubMenu } = Menu
// import { Menu } from 'react-contextmenu'
// const { ContextMenu, MenuItem, SubMenu } = Menu
//
// import { Menu } from 'react-data-grid-addons'

import 'react-data-grid-addons'
import { ContextMenu, MenuItem, SubMenu } from 'react-contextmenu'

// import styles from './Menu.css' //  global, doesn't work if hashed.
class MyMenu extends React.Component {
  static propTypes = {
    onRowDelete: PropTypes.func.isRequired,
    onRowInsertAbove: PropTypes.func.isRequired,
    onRowInsertBelow: PropTypes.func.isRequired,
    rowIdx: PropTypes.number,
    idx: PropTypes.number
  }
  onRowDelete = (e, data) => {
    const { onRowDelete } = this.props
    if (typeof onRowDelete === 'function') {
      onRowDelete(e, data)
    }
  }
  onRowInsertAbove = (e, data) => {
    const { onRowInsertAbove } = this.props
    if (typeof onRowInsertAbove === 'function') {
      onRowInsertAbove(e, data)
    }
  }
  onRowInsertBelow = (e, data) => {
    const { onRowInsertBelow } = this.props
    if (typeof onRowInsertBelow === 'function') {
      onRowInsertBelow(e, data)
    }
  }

  render () {
    return (
      <ContextMenu id='reactDataGridContextMenu' identifier="reactDataGridContextMenu">
        <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowDelete}>Delete Row</MenuItem>
        <SubMenu title='Insert Row'>
          <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowInsertAbove}>Above</MenuItem>
          <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowInsertBelow}>Below</MenuItem>
        </SubMenu>
      </ContextMenu>
    )
  }
}

export default MyMenu
