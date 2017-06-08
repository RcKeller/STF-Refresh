import config from 'config'
import assets from '../../../public/assets/manifest.json'

const createAppScript = () => `<script type="text/javascript" charset="utf-8" src="/assets/${assets['app.js']}"></script>`

const createTrackingScript = () => config.has('analytics.google') ? createAnalyticsSnippet(config.get('analytics.google')) : ''

const createAnalyticsSnippet = id =>
  `<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', '${id}', 'auto');
ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>`

const createStylesheets = () => `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans" />
<link rel="stylesheet" href="/assets/${assets['app.css']}" />
`

export { createAppScript, createTrackingScript, createStylesheets }
