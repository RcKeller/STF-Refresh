import React from 'react'
import Helmet from 'react-helmet'

/*
FAQ PAGE: .../faq
Frequently asked questions, CYA stuff
Addresses a lot of edge cases
*/
import styles from './API.css'
class API extends React.Component {
  render (
  ) {
    return (
      <article className={styles['api']}>
        <Helmet title='API Documentation' />
        <section>
          <h1 id='uwstfapi'>UWSTF API</h1>
          <h2 id='version2'>## Version 2</h2>
          <p>The Student Technology Committee is obligated by the Open Public Meetings Act (OPMA - <a href='http://apps.leg.wa.gov/rcw/default.aspx?cite=42.30'>RCW 42.30</a>) to provide complete and unrestricted access to all data related to committee operations, including information about campus technology projects, voting records, and endorsement data.
             In addition to our legal obligations, we value transparency in our engineering practices - our web platform is <a href='https://github.com/RcKeller/STF-Refresh'>Open Source</a> and unrestricted read-only access to our API is available to the public.
          </p>
          <p>This API and the associated web platform are provided under the MIT license - and thus as-is without warranty or service agreement.</p>
          <p>Database Models:</p>
          <ul>
            <li><strong>proposal</strong>: Proposal metadata (titles, status, asked and received values)</li>
            <li><strong>project</strong>: Proposal content - either a project plan or array of textual content</li>
            <li><strong>contact</strong>: A point of contact</li>
            <li><strong>comment</strong>: An endorsement for a proposal</li>
            <li><strong>manifest</strong>: Individual budgets of various types (original requests, supplemental funds requests, partial / alternative budgets)</li>
            <li><strong>item</strong>: Items in a budget manifest, including quantity and tax rate</li>
            <li><strong>report</strong>: Expense reports recorded by recipients of an award</li>
            <li><strong>review</strong>: A committee member's votes for a budget (approve or deny, metrics on various qualities)</li>
            <li><strong>decision</strong>: Decisions issued for budgets (approved, denied, etc).</li>
            <li><strong>block</strong>: Committee special projects and continuously funded projects</li>
          </ul>
          <h2 id='gettingstarted'>Getting Started</h2>
          <p>The UWSTF uses document stores with denormalized / NoSQL data schemes. Every entity in the database contains an <code>_id</code> property, which is a unique identifier. Entities that are related are linked by including these <code>_id</code>s, which can be joined by the <code>populate</code> query parameter.</p>
          <h3 id='simplequeries'>Simple Queries</h3>
          <p>To get all instances of a basic model, you simply need to visit the route for the model like so:</p>
          <pre><code className='https language-https'>https://uwstf.org/v2/proposal/
          </code></pre>
          <p>And to query a specific entity, all you need to do is append the <code>_id</code> property to the route:</p>
          <pre>
            <code>
              {`https://uwstf.org/v2/proposal/59cad427819acc99240ea08d/`}
            </code>
          </pre>
          <h3 id='advancedqueries'>Advanced Queries</h3>
          <h4 id='nestedquery'>Nested Query</h4>
          <p>Supports basic filtering conditions and operands.</p>
          <pre>
            <code>{`
https://uwstf.org/v2/proposal/?query={"year":2018}
https://uwstf.org/v2/proposal/?query={"year":"&lt;2018"}
https://uwstf.org/v2/proposal/?query={"received":"&gt;0"}
https://uwstf.org/v2/proposal/?query={"year":"2018","status":"In Review"}
          `}</code>
          </pre>
          <h4 id='select'>Select</h4>
          <p>Sort an array of entities by property and operator.</p>
          <pre>
            <code>{`
https://uwstf.org/v2/proposal/?select=title
https://uwstf.org/v2/proposal/?select=["year","number","title"]
          `}</code>
          </pre>
          <h4 id='sort'>Sort</h4>
          <p>Sort an array of entities by property and operator.</p>
          <pre>
            <code>{`
https://uwstf.org/v2/proposal/?sort=number
https://uwstf.org/v2/proposal/sort=-number
https://uwstf.org/v2/proposal/sort={"number":1}
https://uwstf.org/v2/proposal/sort={"number":0}
            `}</code>
          </pre>
          <h4 id='limit'>Limit</h4>
          <p>Set a cap on the amount of entities returned by the query.</p>
          <pre>
            <code>{`
https://uwstf.org/v2/proposal/?limit=10
          `}</code>
          </pre>
          <h4 id='distinct'>Distinct</h4>
          <p>Returns the unique elements found in all entities queried, e.g. this query returns all organizations we work with:</p>
          <pre>
            <code>{`
https://uwstf.org/v2/proposal/?distinct=organization
          `}</code>
          </pre>
          <h3 id='populatingdocuments'>Populating Documents</h3>
          <p>Related documents are represented by their <code>_id</code> property when they aren't being populated by a query. The namespaces aren't always equivocal to the name of the model itself, e.g. a proposal <code>body</code> is a <code>project</code> model in the database. For example:</p>
          <pre>
            <code className='json language-json'>{`
{
  "_id": "59cad427819acc99240ea08d",
  "title": "Adobe Creative Cloud Software for School of Art Student Computers",
  "body": "59cad427819acc99240ea08f",
  "comments": [
    "59cad427819acc99240eb43c",
    "59cad427819acc99240eb46e",
    "59cad427819acc99240eb47a",
    "59cad427819acc99240eb49b",
    "59cad427819acc99240eb4a1"
  ]
}
          `}</code>
          </pre>
          <p>To populate these fields (known as a <em>join</em> for SQL databases), use the populate query parameter, followed by the field.</p>
          <pre>
            <code>{`
https://uwstf.org/v2/proposal/59cad427819acc99240ea08d/?populate=["body"]
<!-- Or follow the explicit form -->
https://uwstf.org/v2/proposal/59cad427819acc99240ea08d/?populate=[{"path":"body"}]
            `}</code>
          </pre>
          <p>This returns a proposal with its associated project plan. This parameter also accepts other valid parameters just like the root model, which lends itself to very powerful and expressive queries like so:</p>
          <pre>
            <code>{`
<!-- Get the original budget and items for a given proposal by ID -->
https://uwstf.org/v2/proposal/59cad427819acc99240ea08d/?populate=[{"path":"manifests","query":{"type":"original"},"populate":{"path":"items"}}]
<!-- Get the original budget and items for a given proposal year-number form -->
https://uwstf.org/v2/proposal/?query={"year":"2016","number":"1"}&amp;populate=[{"path":"manifests","query":{"type":"original"},"populate":{"path":"items"}}]
          `}</code>
          </pre>
          <h3 id='furtherinformation'>Further Information</h3>
          <p>We curate our own organizational data with strict regulatory policies. For more data outside of the scope of committee operations, your best resource would be the Office of Planning and Budgeting, which publishes reports on student fees on an annual basis. See: <a href='http://opb.washington.edu/sites/default/files/opb/Tuition/2016-17%20Tuition%20%26%20Fee%20History.pdf'>2017 Student Fees</a>.</p>
          <p>In addition to the terms of the MIT license, we ask that you contact STFCweb@uw.edu and inform us of any anticipated usage of the API at scale, such as data visualizations, personal projects, etc. This is so we can account for the load ran against the database. If we suspect abuse, we reserve the right to impose rate limitations and other restrictions.</p>
        </section>
      </article>
    )
  }
}

export default API
