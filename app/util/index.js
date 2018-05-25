/*
Utils are little bits of reusable code for things such as common filtering
(e.g. get a role from a list of cntacts), configs for antd components
(forms and tables are hard to keep DRY), etc.
*/
//  Antd related utilities
export { default as form } from './form'

/*
HELPERS
*/

// Returns a float formatted to 2 decimal places
export const float = (number = 0) => Number.parseFloat(number.toFixed(2))

// Returns a number formatted as dollars
export const currency = (number = 0) => `$${Number.parseInt(number).toLocaleString('en-US')}`

// Returns currency formatted to 2 decimal places
export const exactCurrency = (number = 0) => `$${float(number).toLocaleString('en-US')}`

export const years = _.range(
  2000,
  new Date().getFullYear() + 1
).reverse()
