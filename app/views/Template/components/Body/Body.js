import React from 'react'

import { Layout, Breadcrumb } from 'antd'
const { Content } = Layout

const Body = ({routes, children}) => (
    <div>
      <Breadcrumb />
      {children}
    </div>
)
export default Body
