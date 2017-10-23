import db from '../db'
const controllers = db.controllers

//  GENERATE ROUTES
export default (app) => {
  console.log('REST: Initializing rest API routes')
  /*
  RESTful APIs
  */
  app.use(new controllers.Configs().API())
  app.use(new controllers.Users().API())
  app.use(new controllers.Contacts().API())
  app.use(new controllers.STF().API())
  app.use(new controllers.Comments().API())
  app.use(new controllers.Proposals().API())
  app.use(new controllers.Projects().API())
  app.use(new controllers.Manifests().API())
  app.use(new controllers.Items().API())
  app.use(new controllers.Blocks().API())
  app.use(new controllers.Reviews().API())
  app.use(new controllers.Decisions().API())
  app.use(new controllers.Reports().API())
  console.log(`REST: API live for all ${Object.keys(controllers).length - 1} core models.`)
}
