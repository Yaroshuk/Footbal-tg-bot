import axios from 'axios'
import { BASE_URL } from '../constants/api'
import { DateTime } from 'luxon'
import { parseMatchesResults } from '../parsers'

export const getMatches = async (league: string, isTomorrow: boolean = false, status?: string) => {
  if (!league) {
    console.log('ERROR')
  }

  const date = DateTime.now().toFormat('yyyy-LL-dd')

  const params: any = {
    dateFrom: date,
    dateTo: date,
  }

  if (isTomorrow) {
    const tomorrowDate = DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd')

    params.dateFrom = tomorrowDate
    params.dateTo = tomorrowDate
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
