// https://github.com/adazzle/react-data-grid/issues/1004
const PropTypes = require('prop-types')
// next line is only required until ron-react-autocomplete is rebuilt and republished
PropTypes.component = PropTypes.element
require('react').PropTypes = PropTypes
require('react').createClass = require('create-react-class')
