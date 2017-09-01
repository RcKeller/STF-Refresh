# TODO list
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
