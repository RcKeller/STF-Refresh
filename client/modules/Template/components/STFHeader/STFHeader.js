import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

import Nav from 'react-bootstrap/lib/Nav'
import Navbar from 'react-bootstrap/lib/Navbar'
import NavItem from 'react-bootstrap/lib/NavItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Image from 'react-bootstrap/lib/Image'
// Import Style
import styles from './STFHeader.css'
// Import Images
// import STFLogo from './stf.png'

const LoremIpsumImage = 'https://randomuser.me/api/portraits/med/men/83.jpg'

export function STFHeader (props, context) {
  return (
    <Navbar>
      <Navbar.Header>
        <Link to='/'>
          <Navbar.Brand>
            <div className={styles['stf-logo']} />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />

      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavDropdown title='Proposals' id='basic-nav-dropdown'>
            <LinkContainer to='/proposals/browse/' >
              <MenuItem>Browse All</MenuItem>
            </LinkContainer>
            <LinkContainer to='/proposals/edit/' >
              <MenuItem>My Proposals</MenuItem>
            </LinkContainer>
            <MenuItem divider />
            <LinkContainer to='/proposals/new/' >
              <MenuItem>Submit a Proposal</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <LinkContainer to='/blocks/' >
            <NavItem href='#'>Blocks</NavItem>
          </LinkContainer>
          <LinkContainer to='/calendar/' >
            <NavItem href='#'>Calendar</NavItem>
          </LinkContainer>
          <NavDropdown title='Documents' id='basic-nav-dropdown'>
            <LinkContainer to='/documents/' >
              <MenuItem >Public Documents</MenuItem>
            </LinkContainer>
            <MenuItem href='http://itconnect.uw.edu/wares/acquiring-software-and-hardware/keyserver-help-for-it-staff/' >License Keyserver</MenuItem>
            <LinkContainer to='/docs/rfp.pdf' >
              <MenuItem>Request for Proposals</MenuItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <NavItem>
            <Image className={styles['netid-avatar']} src={LoremIpsumImage} circle />
          </NavItem>
          <LinkContainer to='/shib/'>
          <NavItem>
            NetID
          </NavItem>
        </LinkContainer>

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
STFHeader.contextTypes = {
  router: PropTypes.object
}

export default STFHeader
