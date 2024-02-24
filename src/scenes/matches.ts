import { Context, Scenes } from 'telegraf'
import { DateTime } from 'luxon'
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
      console.log('mat', match)

      await ctx.replyWithHTML(`
      ${match?.date ? `⏳ ${DateTime.fromISO(match?.date).toFormat('T dd-LL-yyyy\n\n')}` : ''}🏚 <b>${
        match.homeTeam.shortName
      } (${match.homeTeam.tla})</b>
      \n🆚     \n\n🚌 <b>${match.awayTeam.shortName} (${match.awayTeam.tla})</b>\n\n`)
    })
  }
})

export default matches
