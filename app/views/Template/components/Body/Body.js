import React from 'react'

import { Breadcrumb } from 'antd'

const Body = ({routes, children}) => (
    <div>
      <Breadcrumb />
      {children}
    </div>
)
export default Body
