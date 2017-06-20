/*
Services include logic that is independent from the component level.
This includes things like authentication, etc.
Logic coupled with a component should be in the respective duck.
In essense, these are "getters" framed in the sense of a feature/service that
isn't coupled with a specific view.
*/
export { default as environment } from './environment'
export { default as authentication } from './authentication'
export { default as proposals } from './proposals'
export { default as blocks } from './blocks'
export { default as contacts } from './contacts'
// export { default as route } from './route'
