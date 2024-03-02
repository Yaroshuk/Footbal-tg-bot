import axios from 'axios'
import { BASE_URL } from '../constants/api'
import { DateTime } from 'luxon'
import { parseMatchesResults } from '../parsers'

export const getMatches = async (league: string, date: string = 'TODAY', status?: string) => {
  if (!league) {
    console.log('ERROR')
  }

  const today = DateTime.now().toFormat('yyyy-LL-dd')

  const params: any = {
    dateFrom: today,
    dateTo: today,
  }

  if (date === 'TOMORROW') {
    const tomorrowDate = DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd')

    params.dateFrom = tomorrowDate
    params.dateTo = tomorrowDate
  }

  if (date === 'WEEK') {
    const weekDate = DateTime.now().plus({ days: 7 }).toFormat('yyyy-LL-dd')

    params.dateFrom = today
    params.dateTo = weekDate
  }

  if (status) {
    params.status = status
  }

  try {
    const response = await axios(`${BASE_URL}competitions/${league}/matches`, {
      params: {
        ...params,
      },
      headers: {
        'X-Auth-Token': process.env.API_TOKEN!,
      },
    })

    if (response.status === 200) {
      const result = parseMatchesResults(response.data)
      return result
    }
  } catch (error) {
    throw new Error(`Flibusta Error: ${error}`)
  }
}
