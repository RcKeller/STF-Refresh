import React from 'react'
import { Layout } from 'antd'
import AppHeader from './Header/Header'
import AppFooter from './Footer/Footer'
import AppSidebar from './Sidebar/Sidebar'

const { Header, Footer, Content } = Layout

class AppLayout extends React.Component {
  render () {
    // const { children, location, fixedHeader } = this.props
    const { children } = this.props
    return (
      <Layout id='app-main-layout' className='ant-layout-has-sider'>
        <AppSidebar />
        <Layout>
          <Header className='app-header'><AppHeader /></Header>
          <Layout>
            <Content className='app-content'>
              {children}
            </Content>
            <Footer className='app-footer'> <AppFooter /> </Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default AppLayout
