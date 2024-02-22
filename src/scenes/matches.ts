import { Context, Scenes } from 'telegraf'
import { matchesKeyboard } from '../utils/keyboard'
import { IMyContext } from '../types'
import { getMatches } from '../services/matches'

const matches = new Scenes.BaseScene<IMyContext>('Matches')

matches.enter(async (ctx: Context) => {
  ctx.reply('Расписание матчей на сегодня', matchesKeyboard())
})

matches.action(/match/, async (ctx) => {
  const data = ctx.callbackQuery.data
  if (!data) return

  const league = data.split('-')[1]

  if (league) {
    ctx.reply(`Смотрим матчи для лиги - ${league}`)

    const result = await getMatches(league)

    if (!result || !result?.length) {
      ctx.reply('Упс, ничего не нашлось')
      return
    }

    ;[...result].forEach(async (match) => {
      await ctx.replyWithMarkdown(`#${match.homeTeam.shortName} VS #${match.awayTeam.shortName}`)
    })
  }

  // if (data) {
  //   const book = await flibusta.getBook(data.split('-')[1])
  //   if (book) {
  //     ctx.session.book = book
  //   }
  // }
})

export default matches
