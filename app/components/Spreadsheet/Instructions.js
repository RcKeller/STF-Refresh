import React from 'react'

import { Alert } from 'antd'

const policy = 'http://finance.uw.edu/ps/reporting-tools/tools-reconciling/sales-and-use-tax'

const Instructions = ({ includesTax = false }) => (
  <Alert type='info' showIcon={false} banner closable={!includesTax}
    message={<div>
      <h4>Editable Spreadsheet:</h4>
      <ul>
        <li>
          <b>Edit Data: </b> Press enter to edit, or start typing to overwrite.
        </li>
        <li>
          <b>Add /Delete Rows: </b> Right click the table and choose add/delete.
        </li>
      </ul>
      {includesTax && <div>
        <h5>Important Tax Information</h5>
        <p>
          Every item needs to include tax unless you have specific permission from UW finance and Procurement. Items untaxed in other states/regions are usually taxed upon receipt by the UW.<a href='#foot-1'><sup>[1]</sup></a>
        </p>
        <p>
          If you have additional questions, please refer to the UW’s policy on taxes <a href={policy} target='_blank' >here</a>.
        </p>
        <hr />
        <small><span id='foot-1'>[1]</span> <i>A few groups on campus have tax exemption issued via certification from the UW, including a few research groups, and The Daily newspaper. If you have this exemption, you should already be aware of it, and do not need to add tax on your requested items.</i></small>
      </div>}
    </div>}
  />
)
export default Instructions
