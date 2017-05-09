import React, { PropTypes } from 'react'

import Nav from 'react-bootstrap/lib/Nav'
import Navbar from 'react-bootstrap/lib/Navbar'
import NavItem from 'react-bootstrap/lib/NavItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'

// Import Style
import styles from './STFHeader.css'
// Import Images
import STFLogo from './stf.png'

export function STFHeader (props, context) {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand className={styles['navbar-brand']}>
          <img src={STFLogo}/>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href='#'>Link</NavItem>
        <NavItem eventKey={2} href='#'>Link</NavItem>
        <NavDropdown eventKey={3} title='Dropdown' id='basic-nav-dropdown'>
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.4}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
    </Navbar>
  )
}
STFHeader.contextTypes = {
  router: React.PropTypes.object
}

export default STFHeader
