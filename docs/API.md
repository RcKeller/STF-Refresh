## EXPRESS.JS REST API
# Version: v1

UW-STF uses a RESTful API to retrieve data from the backend. I'm using a microservice model with the following services:
- **Core Services**: A consistent API for querying schema data (get all or one, update one, delete one).
- **Special Services**: Extensions to core API routes that allow special queries and hydration of data.
- **Authentication**: Unique, secured routes for user data.

### REST Services

| Method | Route | Result |
| :------------- | :------------- | -------------: |
GET | /`version`/`schema`/ | Get all documents for that schema
POST | /`version`/`schema`/`id`/ | Add a new document to the schema
PUT | /`version`/`schema`/`id`/ | Update an existing document
DELETE | /`version`/`schema`/`id`/ | Remove an existing document

For info on querying the API, using populate, etc, check the docs for [express-restify-mongoose](https://florianholzapfel.github.io/express-restify-mongoose/)

### Special Services

Bespoke, for special use only.

### Authentication

Google OAuth is used in development for Psuedo-Auth. This is because UW-Shib is a registration-based service, and can only be accessed by a registered HTTPS domain and their production ports.

| Method | Route | Result |
| :------------- | :------------- | -------------: |
DELETE | /sessions/ | Log a user out
GET | /auth/uw/callback/ | (UW Shibboleth) Callback for populating users
GET | /auth/google/ | (Google OAuth2) Direct to Google OAuth
GET | /auth/google/callback/ | (Google OAuth2) Populate Psuedo-Auth user
