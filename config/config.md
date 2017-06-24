# Config (npm)

Environment variables are a pain to manage, especially in fullstack applications. Thus, I've incorporated a config management library. However, *this does not work on the client side, since you do not have access to node*.

In its current state, the repo has publicly accessible API keys and standard configs. When we move to production, we will leave these, and use a .gitignore and our own private repo containing security files.

The following DO need to be set manually, since they are used on the client side:

| Variable | Example | Usage |
| :------------- | :------------- | -------------: |
VERSION | `v1` | API version
ENV | `development` or `production` | Environment

**Note:** `app/services/environment/` sets your API endpoint based on your ENV. This is because you are going to be changing your ENV a *lot* and that way you don't have to constantly reconfigure your env heavily.

## Usage on the server side

Check out the config docs and make note of how fatal exceptions are thrown if you try `config.get(<value>)` on a value that does not exist. I like this behavior. Your way of checking the truthiness of a config is by using `config.has(<value>)`.
