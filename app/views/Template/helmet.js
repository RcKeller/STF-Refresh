import favicon from '../../images/favicon.ico';

const meta = [
    { charset: 'utf-8' },
    // Meta descriptions are commonly used on search engine result pages to
    // display preview snippets for a given page.
    { name: 'Student Tech Fee - UW', content: 'Driving change and enriching learning environments one project, one proposal at a time.' },
    // Setting IE=edge tells Internet Explorer to use the latest engine to
    //  render the page and execute Javascript
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    // Using the viewport tag allows you to control the width and scaling of
    // the browser's viewport:
    // - include width=device-width to match the screen's width in
    // device-independent pixels
    // - include initial-scale=1 to establish 1:1 relationship between css pixels
    // and device-independent pixels
    // - ensure your page is accessible by not disabling user scaling.
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // Disable tap highlight on IE
    { name: 'msapplication-tap-highlight', content: 'no' },
    // Add to homescreen for Chrome on Android
    { name: 'mobile-web-app-capable', content: 'yes' },
    // Add to homescreen for Safari on IOS
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    { name: 'apple-mobile-web-app-title', content: 'UW STF' },
]
const link = [
    // Add to homescreen for Chrome on Android
    { rel: 'icon', href: favicon }
  ]

export default { meta, link }
