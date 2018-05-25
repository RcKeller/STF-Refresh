import { statusColors, quarterColors, brandColors } from './colors'

export const statusLegend = [
  { title: 'Withdrawn', color: statusColors['Withdrawn'] },
  { title: 'Draft', color: statusColors['Draft'] },
  { title: 'Submitted', color: statusColors['Submitted'] },
  { title: 'In Review', color: statusColors['In Review'] },
  { title: 'Awaiting Decision', color: statusColors['Awaiting Decision'] },
  { title: 'Partially Funded', color: statusColors['Partially Funded'] },
  { title: 'Funded', color: statusColors['Funded'] },
  { title: 'Denied', color: statusColors['Denied'] }
]

export const quarterlyFundingLegend = [
  { title: 'Autumn', color: quarterColors['Autumn'] },
  { title: 'Winter', color: quarterColors['Winter'] },
  { title: 'Spring', color: quarterColors['Spring'] },
  { title: 'Blocks / Special Projects', color: brandColors['Purple'] },
  { title: 'Remaining Funding', color: brandColors['Light Gray'] }
]
