import axios from 'axios'
import { BASE_URL } from '../constants/api'
import { DateTime } from 'luxon'
import { parseMatchesResults } from '../parsers'

export const getMatches = async (league: string) => {
  if (!league) {
    console.log('ERROR')
  }

  const date = DateTime.now().toFormat('yyyy-LL-dd')
  const dateTo = DateTime.now().plus({ days: 2 }).toFormat('yyyy-LL-dd')

  console.log('лига', league)

  try {
    const response = await axios(`${BASE_URL}competitions/${league}/matches`, {
      params: {
        dateFrom: date,
        dateTo: dateTo,
      },
      headers: {
        'X-Auth-Token': '2bacd871e62d42b39e82bf8cf810cdf6',
      },
    })

    if (response.status === 200) {
      console.log('RESULT', response)
      const result = parseMatchesResults(response.data)
      return result
    }
  } catch (error) {
    throw new Error(`Flibusta Error: ${error}`)
  }
}
