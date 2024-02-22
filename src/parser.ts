import axios from 'axios'
import cheerio from 'cheerio'

class Parser {
  static instance: Parser

  private url: string = process.env.URL ?? ''
  private searchUrl: string = process.env.SEARCH_URL ?? ''

  constructor() {
    if (Parser.instance) {
      return Parser.instance
    }

    Parser.instance = this
  }

  async search(search: string) {
    const response = await axios(this.searchUrl, {
      params: {
        ask: search.trim(),
      },
    })

    if (response.status === 200) {
      const result = await this.parseSearchResult(response.data)
      console.log(result)
      if (result && result.length && result[1]) {
        this.getBook(result[1].src!)
      }
    }
    // console.log(data.status)
  }

  async parseSearchResult(data: string) {
    const $ = cheerio.load(data)

    const result = $('#main>ul')
      .last()
      .children()
      .map((index, elem) => ({
        title: $(elem).children('a').first().text(),
        src: $(elem).children('a').first().attr('href'),
        author: $(elem).children('a').last().text(),
      }))
      .get()

    return result
  }

  async parseBookPage(data: string) {
    const $ = cheerio.load(data)

    const result: any = {}

    result.title = $('#main>h1').first().text()
    result.img = $('#main>img').first().text()
    result.description = $('#main>p').first().text()
    result.author = {
      name: $('#main>a').first().text(),
      link: $('#main>a').first().attr('href'),
    }

    return result
  }

  async getBook(url: string) {
    const response = await axios(`${this.url}${url}`)

    if (response.status === 200) {
      const book = await this.parseBookPage(response.data)
      console.log(book)
    }
  }
}

export default Parser
