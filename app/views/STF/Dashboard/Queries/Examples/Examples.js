import React from 'react'

import { Collapse } from 'antd'
const Panel = Collapse.Panel

//  TODO: Reducer pls
const samples = [
  {
    title: 'About Query Tool',
    body: <div>
      <p>Query Tool can fetch and relate specific data from our backend based on simple conditions. For example, you can get proposals and associated contact information for anything unpublished by the query <em>proposal, contacts, unpublished</em>. This tool exists to cater for any edge cases our current BI views cannot cover for you. The script bundle for this component cannot be fetched without an administrative netID, so it should not pose a security concern.</p>
      <p>Please note, this feature is NOT a best practice for webapps. Page slowness and freezing is to be expected at this scale. An alternative would be to learn the query syntax from me and use <a href='https://www.hurl.it/'>hurl.it</a>.</p>
    </div>
  },
  {
    title: 'Example: Find contacts for proposals undergoing review',
    body: <ul>
      <li><b>Model:</b> Proposals</li>
      <li><b>Where:</b> "published": true, "status": "In Review"</li>
      <li><b>Join:</b> contacts</li>
    </ul>
  },
  {
    title: 'Example: View unpublished drafts',
    body: <ul>
      <li><b>Model:</b> Proposals</li>
      <li><b>Where:</b> "published": false, "status": "Draft"</li>
      <li><b>Join:</b> body</li>
    </ul>
  },
  {
    title: 'Example: View budgets proposed during a quarter ',
    body: <ul>
      <li><b>Model:</b> Proposals</li>
      <li><b>Where:</b> "year": 2018, "quarter": "Autumn"</li>
      <li><b>Join:</b> manifests</li>
    </ul>
  },
  {
    title: 'Example: All data for a proposal ID ',
    body: <ul>
      <li><b>Model:</b> Proposals</li>
      <li><b>ID:</b> 59cda050365587271b56cd58</li>
      <li><b>Join:</b> contacts, body, manifests, comments</li>
    </ul>
  }
]

class FAQ extends React.Component {
  render () {
    return (
      <Collapse bordered={false} >
        {samples.map((sample, i) => (
          <Panel header={sample.title} key={i}>
            {sample.body}
          </Panel>
      ))}
      </Collapse>
    )
  }
}

export default FAQ
