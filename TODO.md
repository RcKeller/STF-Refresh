# TODO list

## Restify migration
- Populate Children on returns
Decisions: Update proposal received amount & status
Report - same item issue as manifests. Test this
Proposals: Assign year/number upon publication and announce
Logout route:
logout (req, res) {
  req.logout()
  res.sendStatus(200)
}



DONE: Close nav on navigation events
Fix top bar flexbox/responsiveness.
Add search for docket
DONE: Edit proposal head to show status more elegantly.
Edit manifests (multiple) to show most recent approval.
DONE: Edit tables to have size='middle'
Navigate unaffiliated away from editing
Enforce authorship when rendering tabs
DONE: Remove review tab
Require auth on shib routes?
Fix undefined shib callback urls / backtourl

MAJOR: Find way to save manifests in order.
https://stackoverflow.com/questions/38364474/how-can-i-save-mongoose-in-sync-mode
Sort then save?
---

Enhancements:
  4: Frontpage
  4: Contacts
  4: About Us
4: Shibboleth
5: AWS Deployment


Known issues:
<!-- -Frontpage feed -->
<!-- -Update total received -->
-Update review page
-Update contacts update page
POST of a new proposal's manifest is failing to go through, though no errors are logged.
Proposal refresh not working

What should the initial value for supplements be?
Flag for marking reports as finished.

Security features intentionally disabled for testing:
  -Edit page:
    Disabled redirection of unaffiliated users
    Can edit published proposals (later, this will lock you out after a week)
    Can duplicate netIDs across forms (Use a single person as the primary/budget/org contact)
    Disabled verification of signer's netID (can sign as another person's netID)
  -Proposal page:
    Report completion

Features up for debate:
  - Metrics currently do not refresh, upon update, since I want to capture a "snapshot" in time when you load the page. We could have this be real time, but we lose the benefit of being  able to compare before-after voting meetings.

Known issues:
  Refresh buttons

Quirks of note:
  Occasionally, when creating a new proposal, initial budgets that are submitted are dropped. I need help tracing the circumstances behind this.
  To enforce consistency in the editing page, we pull data from the server every time a tab is selected. This prevents a erroneous field on the client side from being pushed and propegating multiple times, enforcing some integrity.
  For the Proposal/Reviews page, I need to know what you want to see. Metrics? Reviews? Decisions and their total breakdown? I built that page a long time ago and now that I've added committee/dashboard, I'm not so sure that it's necessary.
  Currently, proposal statuses have to be updated after a decision has been issued. I am unsure where this logic should go, since we've discussed the need for a human element as an intermediary.
  Should voting be a separate page?
