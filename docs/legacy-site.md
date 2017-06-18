# Current Site

### Pain Points
A significant amount of technical debt.

- Database needs normalization and currently has two parallel sets of proposal records
- Packages are version-locked
  - All view files have to be updated or replaced due to depreciation of syntax.
- Authentication should be refactored due to performance impact
  - No auth solution for dev environment, crashing any local development.
- State management in express needs to be further documented
  - Unclear entry points, view files expect undocumented data
    - Prior procedure for tracking state was logging to the server console and copy/pasting.
  - Lack of any debugging capability. Break your code, **you get a blank page instead of errors**.
- Styling has many issues
  - Views use a combination of css files and inline styles.
  - Having 12+ global css files is terrible practice, even if there are no current conflicts.
  - Mobile responsiveness is not fully achieved and I'm going through the existing code base and introducing fixes.
- There is no standardized workflow
  - No automated testing or deployment automation process.
    - Current process involves connecting to the production server and introducing changes outside maintenance windows, which breaks financial transactions.

### Feature Requests

- Proposer information / financial data included in browse proposals view.
  - Extremely important for OP&B, Sara & just everyone in general.
- A more robust proposal screening process.
  - More questions framed in the current vs. future state format. What have you tried? What doors did you knock on before coming to the STF?
  - Some fair, yet reasonable questions to weed out personal / research projects masquerading as student use.
- Data Visualization
  - No way in hell we're using D3 with the current stack, but we have a very rich database that goes way back. Going into the future I'd like to develop features and visualizations to convey the impact STF has had on UW.
- Asset tracking
  - Big side project, we haven't gotten too far into the details but this would be a system for tracking assets associated with the STF. Literally tracing student funds down to the very endpoint or service rendered.
- Internal tools incl. site tracker (one of my ideas) - there's an entire lifecycle to a proposal including site visits, and I think the proposal process is only one piece of a bigger picture. STF members should have a robust view that provides information about departments, proposers, workshops, etc.
  - Depending on the need, I think we may also want budgeting tools or some way to track funding closer. Not that there's anything wrong with the human element of maintaining budget sheets.
