export const parseMatchesResults = (data: any) => {
  const result = { matches: [], league: '', emblem: '' }

  if (data?.competition?.name) {
    result.league = data?.competition?.name
  }

  if (data?.competition?.emblem) {
    result.emblem = data?.competition?.emblem
  }

  if (!data.matches || !Array.isArray(data.matches)) return result

  return data?.matches.reduce((acc: any[], match: any) => {
    const result = {
      homeTeam: match?.homeTeam,
      awayTeam: match?.awayTeam,
      date: match?.utcDate ?? '',
      status: match?.status ?? '',
    }

    return [...acc, result]
  }, [])
}
