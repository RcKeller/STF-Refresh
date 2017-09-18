import REST from './rest'
import { Proposal } from '../models'
import { Slack } from '../../integrations'

export default class Proposals extends REST {
  constructor () {
    super(Proposal, '_id')
  }
  // /* *****
  //   POST: Add a model
  //   Hydrate new proposals with a year and quarter
  // ***** */
  // post (data, query) {
  //   let date = new Date()
  //   const year = date.getFullYear()
  //   const quarter = this.determineQuarter(date)
  //   let hydratedData = Object.assign(data, { year, quarter })
  //   //  NOTE: Number is determined upon publication in patch.
  //   return super.post(hydratedData, query)
  // }

  /* *****
    PATCH: Update a model
    Publishing? Check if the proposal has a number. If it's entering publication without one, determine  and assign
  ***** */
  patch (id, data, query) {
    //  If this was just published And the proposal isn't numbered yet
    console.warn('data')
    if (data.published) {
      const date = new Date()
      const year = date.getFullYear()
      const quarter = this.determineQuarter(date)
      data = Object.assign(data, { year, quarter })
      this.model
        .findOne({ [this.key]: id })
        .then(model => {
          if (!model.number) {
            //  Determine the next sequential number per year, assign to data.
            const year = new Date().getFullYear()
            this.model
              .find({ year })
              .select('number')
              .then(models => {
                //  Extract numbers, reverse sort, highest value + 1
                const sorted = models
                  .map(proposal =>
                      Number.isInteger(proposal.number)
                      ? proposal.number
                      : proposal.number
                    )
                  .sort((a, b) => b - a)
                const number = Number.isInteger(sorted[0])
                  ? sorted[0] + 1
                  : 1
                const newData = Object.assign({}, data, { number })
                return super
                  .patch(id, newData, query)
                  .then(doc => {
                    // Slack.post('test', JSON.stringify(doc))
                    // Slack.announceNewProposal(doc)
                    this.announceNew(id)
                    return doc
                  })
              })
          } else {
            return super.patch(id, data, query)
          }
        })
    }
    return super.patch(id, data, query)
  }

  //  This logic is going to change on a per year basis.
  //  https://www.washington.edu/students/reg/1718cal.html
  determineQuarter (givenDate) {
    const month = givenDate.getMonth() + 1 // without increment, 0 = january
    const date = givenDate.getDate() //  1-31
    let quarter = 'Summer'
    switch (month) {
        //  Winter: Jan-March 25
      case '1': case '2':
        quarter = 'Winter'
        break
      case '3':
        date < 26
          ? quarter = 'Winter'
          : quarter = 'Spring'
        break
      //  Spring: March 26 - June 17
      case '4': case '5':
        quarter = 'Spring'
        break
      case '6':
        date < 18
          ? quarter = 'Spring'
          : quarter = 'Summer'
        break
      //  Summer - June 18 - Sept 26
      case '7': case '8':
        quarter = 'Summer'
        break
      case '9':
        date <= 27
          ? quarter = 'Summer'
          : quarter = 'Autumn'
        break
      //  Autumn - Sept 27 - End of Year
      case '10': case '11': case '12':
        quarter = 'Autumn'
        break
    }
    return quarter
  }
  announceNew (id) {
    return this.model
      .findById(id)
      .populate('body contacts')
      .then(doc => Slack.announceProposal(doc))
      .catch(err => console.warn(err))
  }
}
