// const required = value => (value ? undefined : 'Required')
// const maxLength = max => value =>
//   value && value.length > max ? `Must be ${max} characters or less` : undefined
// const minLength = min => value =>
//   value && value.length < min ? `Must be ${min} characters or more` : undefined
// const number = value =>
//   value && isNaN(Number(value)) ? 'Must be a number' : undefined
// const minValue = min => value =>
//   value && value < min ? `Must be at least ${min}` : undefined
// const email = value =>
//   value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
//     ? 'Invalid email address'
//     : undefined
// const alphaNumeric = value =>
//   value && /[^a-zA-Z0-9 ]/i.test(value)
//     ? 'Only alphanumeric characters'
//     : undefined
// const phoneNumber = value =>
//   value && !/^(0|[1-9][0-9]{9})$/i.test(value)
//     ? 'Invalid phone number, must be 10 digits'
//     : undefined
// export default {
//   required,
//   maxLength,
//   minLength,
//   number,
//   minValue,
//   email,
//   alphaNumeric,
//   phoneNumber
// }

const validate = values => {
  let errors = {}
  const requiredFields = [
    'title',
    'category',
    'organization'
  ]
  requiredFields.forEach(field => {
    if (!values[field]) errors[field] = 'Required'
  })
  // if (!values.title) errors.title = 'Required'
  // if (!values.category) errors.category = 'Required'
  // if (!values.organization) errors.organization = 'Required'

  // const requiredSigners = ['primary', 'budget', 'organization']
  // requiredSigners.map((role) => {
  //   if (!values.contacts['role'].name
  //   ) errors.contacts['role'].name = 'Required'
  //   if (!values.contacts['role'].netID
  //   ) errors.contacts['role'].netID = 'Required'
  //   if (!values.contacts['role'].phone
  // ) errors.contacts['role'].phone = 'Required'
  // })

  return errors
}
export default validate

// // } else if (values.username.length > 15) {
// //   errors.username = 'Must be 15 characters or less'
// // }
// // if (!values.email) {
// //   errors.email = 'Required'
// // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
// //   errors.email = 'Invalid email address'
// // }
// // if (!values.age) {
// //   errors.age = 'Required'
// // } else if (isNaN(Number(values.age))) {
// //   errors.age = 'Must be a number'
// // } else if (Number(values.age) < 18) {
// //   errors.age = 'Sorry, you must be at least 18 years old'
// // }
