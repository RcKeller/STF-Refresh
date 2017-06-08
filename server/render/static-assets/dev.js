import config from 'config'

const createAppScript = () => '<script type="text/javascript" charset="utf-8" src="/assets/app.js"></script>'

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
`
/* UW CSS CDN
<link rel="stylesheet" id="uw-master-css"  href="https://www.washington.edu/wp-content/themes/uw-2014/style.css?ver=3.6" type="text/css" media="all" />
*/

export { createAppScript, createTrackingScript, createStylesheets }
