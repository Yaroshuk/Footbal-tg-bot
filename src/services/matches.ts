import axios from 'axios'
import { BASE_URL } from '../constants/api'
import { DateTime } from 'luxon'
import { parseMatchesResults } from '../parsers'

export const getMatches = async (league: string, status?: string) => {
  if (!league) {
    console.log('ERROR')
  }

  const params: any = {
    dateFrom: DateTime.now().toFormat('yyyy-LL-dd'),
    dateTo: DateTime.now().plus({ days: 2 }).toFormat('yyyy-LL-dd'),
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
        'X-Auth-Token': '2bacd871e62d42b39e82bf8cf810cdf6',
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
