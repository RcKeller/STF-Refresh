import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

// Import Style
import styles from './FAQ.css'
class FAQ extends React.Component {
  render () {
    return (
      <div className={styles['faq']}>
        <Row>
          <Col xs={12} md={9}>
            <h2>General</h2>

            <h4>May I attend a Meeting?</h4>
            <p>
          Yes! All meetings are open to any visitors. Due to time constraints, you may not be able to ask questions to presenters or the committee, but we encourage and welcome visitors. All of our meetings are posted on the <a href='/calendar'>calendar</a>.
        </p>

            <h4>Does the STF Committee use all of its funds?</h4>
            <p>
          Over several fiscal years, all money given to STF by the fee is expended for student technological needs. In any given year, the Committee may decide not to use all its funds, due to low proposal numbers, low quality proposals, or expected higher-than-average need the following year. These funds roll into the next fiscal year.
        </p>

            <h4>I'm a Graduate or Professional Student, how does the STF work for me?</h4>
            <p>
            You pay the same STF that all other students at UW pays. As such, we consider your place in the general student body, and the needs you have. While a specific resource we fund may not be utilized very much by the graduate community, others usually will.
          </p>

            <h4>I'm a Student, am I required to pay the fee?</h4>
            <p>
            Yes. The STF is part of your tuition bill. All matriculated students of the University of Washington must pay the fee, as dictated by the Washington State Legislature. For more info, see
          </p>

            <hr />
            <h2>Proposal Authors</h2>

            <h4>What happened to Fast Track?</h4>
            <p>
            The STFC is moving from a yearly funding schedule to a quarterly schedule. Fast Track proposals were for time-sensitive funding methods and were handled early Winter Quarter. As the committee now approves groups quarterly, there is no longer a need for the Fast Track process.
          </p>

            <h4>When will I receive my funds?</h4>
            <p>
            Funds are sent out by the first day of the next quarter. The exception to this is Spring Quarter, the funds of which will be available starting July 1st. All budgets close on June 30th.
          </p>

            <h4>Will you fund my department's basic technological needs?</h4>
            <p>
            Likely, no. The STF exists to supplement student technological needs, not as a crutch for departments. It is expected that a fictional Department of Underwater Basket Weaving would provide its students with wicker and water, which seem rather essential to the education of that department's students. The Committee expects departments to fund such basic requirements. A good rule of thumb is if the answer to the question "Could my students learn without [item]" is "no", the committee will likely ask the department to fund the item. More information is available in the Instructional Use document, <a href='/documents/Findings'>here</a>.
    </p>

            <h4>How can I best present to the committee?</h4>
            <p>
            A good presentation quickly goes over what the proposal is, the purpose of the proposal, how many students will use the funded proposal, any past similar proposals, any similar funded proposals already on campus, and departmental support.
          </p>

            <h4>How long may I present for?</h4>
            <p>
            You will have about 3-5 minutes to present, and then will be questioned by the committee until seen fit. A lack or plethora of questions does not indicate how the committee will vote.
          </p>

            <h4>Should I present for the whole time?</h4>
            <p>
            Often, no. Simple proposals, such as for printers or a small computer lab, often do not need to spend the whole allotted time. Committee members will ask questsions to fill in any knowledge gaps that they missed out on if confused. More complicated proposals generally should spend more time explaining, but if you run out of words to say, just end your presentation early to allow for more questions if need be.
          </p>

            <h4>What are metrics?</h4>
            <p>
            At any time, although frequently during your presentation and in the time immediately after, the committee members will rank the perceived performance of your proposal, were the committee to fund it. This is a not an exact science, but we try to do the best we can to be impartial to the proposal. We use these metrics as a guide when voting on whether to fund a proposal later in the year. Metrics are never the be-all end-all of our decision making process, and are merely there as an additional help to our regular process of discussion during voting.
          </p>

            <h4>Are there often conflicts of interest?</h4>
            <p>
            Most committee members have many roles throughout campus and ASUW, leading to frequent conflicts of interest were a member to vote on a proposal that would directly impact their other positions within the university. For this reason, members will recuse themselves during voting on a proposal were it to directly impact them.
          </p>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}
const mapDispatchToProps = (dispatch) => {
  return {}
}
// FAQ.propTypes = {
// }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FAQ)
