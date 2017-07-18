import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Menu, Icon, Alert } from 'antd'
const SubMenu = Menu.SubMenu
// const ItemGroup = Menu.ItemGroup
const Item = Menu.Item
const ItemGroup = Menu.ItemGroup

const keyserver = 'http://itconnect.uw.edu/wares/acquiring-software-and-hardware/keyserver-help-for-it-staff/'

import styles from './Nav.css'
@connect(state => ({
  // location: state.routing ? state.routing.locationBeforeTransitions.pathname : '',
  location: '',
  user: state.user
}))
class Nav extends React.Component {
  render ({ router, location, user: { committee } } = this.props) {
    console.log(committee)
    return (
      <Menu mode='inline'
        defaultSelectedKeys={['1']}
        selectedKeys={[location]}
        // selectedKeys={location ? [location] : ['1']}
        // selectedKeys={[router.location.pathname]}
        onClick={(i) => i.key && router.push(i.key)}
      >
        {true &&
          <SubMenu key='sub1' title={<span><Icon type='safety' /><span>Committee</span></span>}>
            <Item key='/knowledge'>
              <Icon type='book' /><span className='nav-text'>Knowledge Base</span>
            </Item>
            {true && <ItemGroup key='g1' title='Members'>
              <Item key='/dashboard'>
                <Icon type='team' /><span className='nav-text'>Dashboard</span>
              </Item>
              <Item key='/voting/'>
                <Icon type='unlock' /><span className='nav-text'>Voting Tools</span>
              </Item>
              </ItemGroup>}
            {true && <ItemGroup key='g2' title='Admins'>
              <Item key='/docket'>
                <Icon type='schedule' /><span className='nav-text'>Docket</span>
              </Item>
              <Item key='/config'>
                <Icon type='setting' /><span className='nav-text'>Site Config</span>
              </Item>
            </ItemGroup>}
          </SubMenu>
        }
        <Item key='/proposals'>
          <Icon type='solution' /><span className='nav-text'>Proposals</span>
        </Item>
        <Item key='/blocks'>
          <Icon type='desktop' /><span className='nav-text'>Block Funding</span>
        </Item>
        <Item key='/faq'>
          <Icon type='question' /><span className='nav-text'>F.A.Q.</span>
        </Item>
        <Item key='/about'>
          <Icon type='info' /><span className='nav-text'>About</span>
        </Item>
        <Item key='/contact'>
          <Icon type='team' /><span className='nav-text'>Contact Us</span>
        </Item>
        <SubMenu key='sub2' title={<span><Icon type='folder-open' /><span>Documents</span></span>}>
          <Item key='/documents'>Commitee Docs</Item>
          <Item key='/docs/Current Request for Proposals.pdf' >Request for Proposals</Item>
          <Item key=''>
            <a href={keyserver} target='_blank'>License Keyserver</a>
          </Item>
        </SubMenu>

        <Alert type='info' banner showIcon
          message='Meetings'
          description={<span>Every Monday<br />3:30 - 5:30PM<br />HUB 305</span>}
        />
      </Menu>
    )
  }
}
Nav.propTypes = {
  user: PropTypes.object
}
export default Nav
