import { Context, Scenes } from 'telegraf'
import { DateTime } from 'luxon'
import { matchesKeyboard, dateKeyboard, additionalMatchesKeyboard } from '../utils/keyboard'
import { IMyContext } from '../types'
import { getMatches } from '../services/matches'

const matches = new Scenes.BaseScene<IMyContext>('Matches')

matches.enter(async (ctx: Context) => {
  ctx.reply('Расписание футбольных матчей', dateKeyboard())
})

matches.action(/date/, async (ctx) => {
  const data = ctx.callbackQuery.data
  if (!data) return

  const date = data.split('-')[1]

  if (date === 'TOMORROW') {
    ctx.session.isTomorrow = true
  } else {
    ctx.session.isTomorrow = false
  }

  ctx.reply(`Расписание матчей на ${ctx.session.isTomorrow ? 'завтра' : 'сегодня'}`, matchesKeyboard())
})

matches.action(/match/, async (ctx) => {
  const data = ctx.callbackQuery.data
  if (!data) return

  const league = data.split('-')[1]

  if (league) {
    ctx.reply(`Смотрим матчи для лиги - ${league}`)

    const result = await getMatches(league, ctx.session.isTomorrow ?? false)

    if (!result || !result?.length) {
      ctx.reply('Упс, ничего не нашлось')
      return
    }

    const matches = [...result]

    for (const match of matches) {
      await ctx.replyWithHTML(`
      ${match?.date ? `⏳ ${DateTime.fromISO(match?.date).toFormat('T dd-LL-yyyy\n\n')}` : ''}🏚 <b>${
        match.homeTeam.shortName
      } (${match.homeTeam.tla})</b>
      \n🆚     \n\n🚌 <b>${match.awayTeam.shortName} (${match.awayTeam.tla})</b>\n\n`)
    }

    await ctx.reply(
      `Расписание матчей на ${ctx.session.isTomorrow ? 'завтра' : 'сегодня'}`,
      additionalMatchesKeyboard()
    )
    return
  }

  await ctx.scene.reenter()
})

matches.action(/action/, async (ctx) => {
  const data = ctx.callbackQuery.data
  if (!data) return

  const date = data.split('-')[1]

  if (date === 'RESTART') {
    return ctx.scene.reenter()
  }

  if (date === 'MENU') {
    return ctx.scene.enter('Start')
  }

  ctx.scene.reenter()
})

export default matches
