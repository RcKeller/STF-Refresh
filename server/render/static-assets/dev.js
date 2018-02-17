import config from 'config'
let manifest = {'common.js': 'common.js', 'vendor.js': 'vendor.js', 'app.js': 'app.js'}

const createAppScript = () => {
  /*
  NOTE: Removed <script async ... > due to render issues (vendor bundles do not exist with HMR)
  https://github.com/reactGo/reactGo/pull/920
  DO NOT REINTRODUCE ASYNC TAGS FOR SCRIPTS. It will break your dev server randomly.
  */
  return `
    <script src="/assets/${manifest['common.js']}"></script>
    <script src="/assets/${manifest['vendor.js']}"></script>
    <script async src="/assets/${manifest['app.js']}"></script>
  `
}

const createTrackingScript = () => config.has('analytics.google') ? createAnalyticsSnippet(config.get('analytics.google')) : ''

const createAnalyticsSnippet = id =>
  `<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', '${id}', 'auto');
ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>`

const createStylesheets = () => `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans" />`
/*
UW CSS CDN:
(Inadvisable - the styles are poor, unperformant, incompatible and huge w/o caching capabilities)
<link rel="stylesheet" id="uw-master-css"  href="https://www.washington.edu/wp-content/themes/uw-2014/style.css?ver=3.6" type="text/css" media="all" />
*/

export { createAppScript, createTrackingScript, createStylesheets }
