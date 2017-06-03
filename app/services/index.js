/*
Services include logic that is independent from the component level.
This includes things like authentication, etc.
Logic coupled with a component should be in the respective duck.
*/

export { default as authService } from './authentication'
