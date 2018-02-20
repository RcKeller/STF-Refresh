import React from 'react'
import Helmet from 'react-helmet'

/*
CSF PAGE: .../blocks/csf
Special project during the 2017-2018 academic year
Per OPMA, we cannot change the verbage, only incorporate it.
Thus, this is a custom route added to /blocks/
*/
import styles from './CSF.css'
class CSF extends React.Component {
  CSFGrant = 'https://drive.google.com/file/d/1Wt3aqbBMxyfGB-GW2tj5lBpdj2sQSIpj/view?usp=sharing'
  render () {
    return (
      <article className={styles['article']}>
        <Helmet title='Campus Sustainability Fund' />
        <h1>Campus Sustainability Fund</h1>
        <h2>Special Project Terms</h2>
        <h6>Source: <a href={this.CSFGrant} target='_blank'>CSF Grant - 1/22/2018</a></h6>
        <hr />
        <br />
        <p>
          The CSF will receive a grant of $200,000 from the STFC for allocation during the 2017-2018 academic year. The CSF may provide projects that it funds with funds from this grant, so long as those funds are earmarked for capital expenditures. Additionally, funds granted by the STFC must be spent towards projects that provide demonstrable benefit to students.
        </p>
        <h6 className={styles['list-header']}>Examples of acceptable allocation of STF funds include:</h6>
        <ul className={styles['list']}>
          <li>
            Purchase, shipping, and installment of real capital which is made available for general student use.
          </li>
          <li>
            Purchase of capital which is not intended for general student use, but is an integral part of a project which provides educational opportunities for students. Projects must provide students with the opportunity to gain knowledge, skills, or networking opportunities beneficial to their academic or career pursuits.
          </li>
        </ul>
        <h6 className={styles['list-header']}>Examples of unacceptable allocation of STF funds include:</h6>
        <ul className={styles['list']}>
          <li>
            Payment of wages for students, staff, or faculty (this may be revisited in future years).
          </li>
          <li>
            CSFC administrative costs.
          </li>
          <li>
            Projects intended to provide ecological or sustainability benefits with minimal student involvement.
          </li>
          <li>
            Non-capital expenditures such as transportation costs, permit fees, or services.
            Note: Costs which are immediately connected to the purchase or real capital such as professional installation can be considered capital expenditures.
          </li>
          <li>
            Consumables (as defined by STF Consumables policy)
          </li>
        </ul>
        <h2 className={styles['subheader']}>Reporting Requirements</h2>
        <p>
          The CSF will provide an annual report to the STF, due by the last week of Winter Quarter, as well as a copy of CSF’s Unit Orientation Document and Budget Document for the Services & Activities Fee (SAF) Committee. This report will include:
        </p>
        <ul className={styles['list']}>
          <li>
            A list of CSF projects which have received STF funds.
          </li>
          <li>
            Financial documentation showing how STF funds were spent for each project. Reports from budget administrators including proof of purchases.
          </li>
          <li>
            A written statement explaining how these expenditures represent (a) the purchase of capital which (b) provides demonstrable benefit to students.
          </li>
        </ul>
        <p>
          Additionally, a brief report will be due after each funding cycle detailing funding allocations of each cycle. The reports will include a description of each project funded, detailing: amount allocated, department, anticipated length of project, which items will be funded with STF funds, and the names of primary and secondary contact. Each report will be due by no later than three weeks after funds are allocated by CSF. The reports will typically be due in April and June.
        </p>
        <p>
          The STF will review these reports and take them into consideration when considering future grants to the CSF.
        </p>
      </article>
    )
  }
}

export default CSF
