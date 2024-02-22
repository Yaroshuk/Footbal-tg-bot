export const parseMatchesResults = (data: any) => {
  if (!data.matches || !Array.isArray(data.matches)) return []
  return data?.matches.reduce((acc: any[], match: any) => {
    const result = {
      homeTeam: match?.homeTeam,
      awayTeam: match?.awayTeam,
    }

    return [...acc, result]
  }, [])
}
