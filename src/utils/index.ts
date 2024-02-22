export const getParamFromURL = (url: string, param: string) => {
  const queryString = url.split('?')?.[1] ?? url.split('?')[0]

  console.log('111', url)

  const queryParams = new URLSearchParams(queryString)

  return queryParams.get(param)
}
