import config from 'config'
import assets from '../../../public/assets/manifest.json'

import fs from 'fs'
import path from 'path'
// Use fs.readFileSync(...) instead of require(...) to avoid webpack complaining about missing file
const manifestPath = path.join(process.cwd(), 'public/assets/app-manifest.json')
let manifest = {'common.js': 'common.js', 'vendor.js': 'vendor.js', 'app.js': 'app.js'}

if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath), 'utf8')
}

const createAppScript = () => {
  return `
    <script async src="/assets/${manifest['common.js']}"></script>
    <script async src="/assets/${manifest['vendor.js']}"></script>
    <script async src="/assets/${manifest['app.js']}"></script>
  `
}

// const createAppScript = () => `<script type="text/javascript" charset="utf-8" src="/assets/${assets['app.js']}"></script>`

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
/* UW CSS CDN
<link rel="stylesheet" id="uw-master-css"  href="https://www.washington.edu/wp-content/themes/uw-2014/style.css?ver=3.6" type="text/css" media="all" />
*/
export { createAppScript, createTrackingScript, createStylesheets }
