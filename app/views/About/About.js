import React from 'react'

import { Row, Col } from 'antd'
import Bio from './Bio/Bio'

const leadership = [
  {
    name: 'Bryce Kolton',
    position: 'STF Chair',
    description: 'Bryce Kolton is the current Chair of the Student Technology Fee Committee, and an ASUW representative at large. This is his fourth year in STF and student government overall. Outside of the Committee, Bryce is a senior in Informatics, taking a custom track which covers a broad range of technological topics. He doesn\'t get much time off of campus, but when he does, Bryce enjoys playing games, hanging with friends, and biking. After graduation, Bryce hopes to work in the technology industry and eventually pivot to politics.',
    photo: 'https://uwstf.org/img/bios/bryce.jpg'
  }, {
    name: 'Alec Meade',
    position: 'Proposal Officer',
    description: 'Alec Meade the current STF Proposal Officer. This is his third year at the University of Washington, and his second year with the STF. Alec is studying Environmental Science and Resource Management, with a focus in Landscape Ecology, and hopes to pursue a career related to environmental policy and planning. When he\'s not in class, Alec enjoys exploring the outdoors, memes, and literature.',
    photo: 'https://uwstf.org/img/bios/alec.jpg'
  }, {
    name: 'Rajiv Raina',
    position: 'Operations & Finance Manager',
    description: 'Rajiv has been the STF finance and operations manager since March of 2016. This is his second year at the University of Washington and he is studying finance in the Foster School of Business. Outside of academia, Rajiv enjoys being active and spends most of his time either at the IMA or hanging out with friends. Rajiv is graduating this spring and looking to pursue a career in investment banking',
    photo: 'https://uwstf.org/img/bios/rajiv.jpg'
  }, {
    name: 'Sara Tores',
    position: 'Student Life Advisor',
    description: 'Sara Torres is the Web Computing Specialist, Technology Manger, and Social Media Coordinator for the Husky Union Building. Sara has served as the Student Life advisor and ex-officio member to the Student Technology Fee Committee since 2010. Outside of UW, Sara enjoys playing softball and is an avid movie and trivia buff. A huge baseball fan, Sara is more than halfway done to touring and/or attending baseball games in all MLB stadiums. Originally from New Mexico, Sara is always on the lookout for restaurants in the greater Seattle area which properly use green chile or have good tamales or sopaipillas on their menu. Suggestions welcomed.',
    photo: 'https://uwstf.org/img/bios/sara.jpg'
  }, {
    name: 'Ryan Keller',
    position: 'Web Developer',
    description: 'Someone else write this..?',
    photo: 'https://avatars2.githubusercontent.com/u/17213821?v=3&s=460'
  }
]

const exOfficios = [
  {
    name: 'Nate McKee',
    position: 'Ex-Officio from UW IT',
    description: 'Nate McKee is the Director of Learning Technologies in UW-Information Technology and serves as an ex-officio member on the Student Technology Fee Committee. His unit provides support for teaching and learning technologies like Canvas and Panopto as well as instructional design, multimedia studios, and the Learning Commons in Odegaard Library',
    photo: 'https://uwstf.org/img/bios/nate.jpg'
  }, {
    name: 'Jennifer Ward',
    position: 'Ex-Officio from UW Libraries',
    description: 'Jennifer Ward is Director of Information Technology Services & Digital Strategies at the UW Libraries. Her unit oversees technology development and deployment for most library systems and services used across the UW. She has served as an ex-officio member on the Student Technology Fee Committee for the last six years. Outside work she plays bassoon and keeps bees, and holds out hope for her own hive on the roof of Suzzallo library.',
    photo: 'https://uwstf.org/img/bios/jennifer.jpg'
  }, {
    name: 'Jeremy Caci',
    position: 'Ex-Officio from Undergraduate Academic Affairs',
    description: 'Jeremy Caci is a software engineer and research analyst for the University of Washington’s division of Undergraduate Academic Affairs. For the past two years he has been using student, financial, and community data to drive program direction and further advancement efforts. He eagerly contributes both his technical and interdepartmental professional experience to the Student Technology Fee Committee through his role as an ex officio member.',
    photo: 'https://uwstf.org/img/bios/jeremy.jpg'
  }
]

const ASUW = [
  {
    name: 'Navid Azodi',
    position: 'ASUW Representative',
    description: 'Navid is a junior studying Business Administration and this is his second year on the STF Committee. Navid has had widespread campus involvement during his time at UW from ASUW, RCSA, First Year Programs, CoMotion, and the Foster School of Business. He works as a Lead for UW Information Technology in Odegaard and is the Director for DubHacks, UW’s hackathon. He is involved in numerous groups on campus promoting innovation, entrepreneurship, inclusion, and diversity. Navid is also a mentor for the UW Leaders program and member of the Provost Advisory Committee for Students.',
    photo: 'https://uwstf.org/img/bios/navid.jpg'
  }, {
    name: 'PAri Gabriel',
    position: 'ASUW Representative',
    description: 'Pari Gabriel is a sophomore currently in the pre-engineering program soon to be applying to the college of Human Centered Design &amp; Engineering. He grew up in the rural city of Prosser, Washington and moved to Seattle in 2015 to attend UW. He loves to stay fit by playing basketball and lifting weights, is a freelance graphic designer, and also works for ASUW as a visual designer under the Office of Communications',
    photo: 'https://uwstf.org/img/bios/pari.jpg'
  }, {
    name: 'Kai Frenay',
    position: 'ASUW Student Senate Liaison',
    description: 'Kai is a Senior from Guam currently studying International Security and Foreign Policy through the Jackson School’s International Studies major. Having also heavily studied Korean language and society he plans to work for the CIA/FBI with a focus on regional stability and foreign policy in Southeast Asia. During his free time he enjoys going on road trips with friends, going to music festivals, playing video games, engaging in politics, investing, and he tries to go to the gym semi-routinely. Outside of his responsibilities to ASUW and STF, he serves as a board officer of the UW College Republicans and is a consultant for the UWIT.',
    photo: 'https://uwstf.org/img/bios/kai.jpg'
  }, {
    name: 'Lizzie Palmer',
    position: 'ASUW Finance and Budget Director',
    description: 'Lizzie Palmer is a junior from Little Rock, Arkansas studying Accounting in the Foster School of Business. Lizzie hopes to pursue a career in tax accounting with either a nonprofit organization or a company known for their corporate social responsibility and community service. During her free time, Lizzie likes to go hiking, travel, and play board games/solve puzzles. She serves as a liaison between the STF Committee and the ASUW Board of Directors as the ASUW Finance &amp; Budget Director. Outside of student government, Lizzie is involved in the Global Case Competition Club and Delta Gamma Sorority as well as various volunteer opportunities across Seattle.',
    photo: 'https://uwstf.org/img/bios/lizzie.jpg'
  }
]
const GPSS = [
  {
    name: 'GPSS Representative',
    position: 'GPSS Representative',
    description: 'Erin Firth is a 5th year graduate student in the school of Oceanography with interest in microbiology and education. She has served in student government for the entire length of her tenure at UW, and has held a position on both the Services and Activities Fee Committee, and Student Technology Fee Committee for multiple years. Erin is a Southern California native, and despite missing the ability to surf during the winter holidays, she greatly enjoys the clouds and rain of Seattle. Erin is also passionate about social justice and activism, especially in regards to the LGBTQ+ community.',
    photo: 'https://uwstf.org/img/bios/erin.jpg'
  }, {
    name: 'Kristen Garofali',
    position: 'GPSS Representative',
    description: 'No biography available.',
    photo: 'https://uwstf.org/img/bios/kristen.jpg'
  }, {
    name: 'Peder Digre',
    position: 'GPSS Representative',
    description: 'Peder Digre is a dual student in the Evans School of Public Policy and Governance and the Department of Global Health pursuing a Master of Public Administration and a Master of Public Health in Health Metrics and Evaluation. Peder became involved in student government last year when he was appointed to be a Graduate and Professional Student Senate (GPSS) Senator from the Department of Global Health. Peder is involved in numerous councils across campus, including as Vice Chair of the Services and Activities Fee Committee, the GPSS Finance and Budget Committee, the GPSS State Legislative Advisory Board, and the Dean’s Advisory Council for Students in the School of Public Health. Peder’s background is in global health, having worked at PATH—a local non-profit—for the past four years. Peder graduated from the University of Washington in 2013 with a BS in Molecular, Cellular, and Developmental Biology and a BA in Scandinavian Studies.',
    photo: 'https://uwstf.org/img/bios/peder.jpg'
  }, {
    name: 'Michaella Rogers',
    position: 'GPSS Treasurer',
    description: 'Michaella Rogers is a second year Master of Public Administration student at the Evans School of Public Policy and Governance and is also pursuing a Technology Entrepreneurship Certificate from the Foster School of Business. She is interested in working on public-private partnerships or in the business for social good sector. She became involved in student government during her first year of grad school and currently serves as Treasurer for the Graduate and Professional Student Senate. She sits on the Services and Activities Fee Committee and Student Technology Fee Committee and chairs the Finance and Budget Committee and the Travel Grants Committee. Michaella is a Colorado native and graduated from the University of Colorado with a BA in International Relations and Italian. She loves to travel, do yoga, paint, hike, try new restaurants and cook',
    photo: 'https://uwstf.org/img/bios/michaella.jpg'
  }
]

import styles from './About.css'
const About = () => (
  <article className={styles['about']}>
    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <h1>The Student Tech Fee</h1>
        <p>
          The Student Technology Fee is a $38 per quarter fee paid by all matriculated students of the University of Washington. The STF pays for additional technological needs of students, both in and out of their regular classes. The STF was created under the powers given by the Washington State Legislature's <a href='http://apps.leg.wa.gov/RCW/default.aspx?cite=28b.15.051'>Technology Fee</a> article, and the University of Washington's <a href='https://www.washington.edu/regents/'>Board of Regents</a>.
        </p>
      </Col>
      <Col xs={24} sm={12}>
        <h1>The STF Committee</h1>
        <p>
            The money brought in by The Student Technology Fee is appropriated by the STF Committee. A group of nine voting members, appointed by both the <a href='http://asuw.org'>Associated Students of the University of Washington</a>, and the <a href='http://depts.washington.edu/gpss/home'>Graduate and Professional Student Senate</a>, accepts proposals for the expenditure of STF funds. Throughout the regular school season, proposal authors present to the committee on why their proposal should be funded.
        </p>
        <p>
            The committee regularly appropriates just shy of $5 million into almost one hundred proposals yearly. Any remaining funds by the end of spring quarter are rolled into the next fiscal year.
        </p>
        <p>
          The Student Technology Fee is entirely student operated and funded. While department heads can request money, funds must always be allocated to student uses. Any technology funded by the STF Committee is appropriated for students only.
        </p>
      </Col>
    </Row>
    <Row gutter={16}>
      <h1>Committee Leadership</h1>
      <p>Members of STF's leadership are non-voting, save for the Chair. They administer the STF program.</p>
      {leadership.map((p, i) => (<Bio key={i} {...p} />))}
    </Row>
    <Row gutter={16}>
      <h1>Committee Members</h1>
      <p>Voting members include the STF Chair, 4 ASUW representatives, and 4 GPSS representatives.</p>
      {ASUW.map((p, i) => (<Bio key={i} {...p} />))}
      {GPSS.map((p, i) => (<Bio key={i} {...p} />))}
      {exOfficios.map((p, i) => (<Bio key={i} {...p} />))}
    </Row>
  </article>
)

export default About
