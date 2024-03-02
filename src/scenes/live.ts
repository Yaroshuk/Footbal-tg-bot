import { Context, Scenes } from 'telegraf'
import { DateTime } from 'luxon'
import { matchesKeyboard } from '../utils/keyboard'
import { IMyContext } from '../types'
import { getMatches } from '../services/matches'
import { steps } from '../middlewares'
import { MESSAGE_TO_LEADUE_MAP } from '../constants/api'

const live = new Scenes.BaseScene<IMyContext>('Live')

live.enter(async (ctx: Context) => {
  ctx.reply('Лайв матчи', matchesKeyboard())
})

// ACTIONS MATCHES
live.hears(['Премьер Лига', 'Лига чемпионов', 'БундесЛига'], steps, async (ctx, next) => {
  const message = ctx.message.text

  const league = MESSAGE_TO_LEADUE_MAP[message] ?? MESSAGE_TO_LEADUE_MAP.default

  ctx.reply(`Смотрим матчи для лиги - ${league}`)

  const result = await getMatches(league, ctx.session.date, 'LIVE')

  if (!result || !result?.length) {
    await ctx.reply('Упс, ничего не нашлось')
    ctx.scene.reenter()
    return
  }

  for (const match of result) {
    await ctx.replyWithHTML(`
      ${match?.date ? `⏳ ${DateTime.fromISO(match?.date).toFormat('T dd-LL-yyyy\n\n')}` : ''}🏚 <b>${
      match.homeTeam.shortName
    } (${match.homeTeam.tla})</b>
      \n🆚     \n\n🚌 <b>${match.awayTeam.shortName} (${match.awayTeam.tla})</b>\n\n`)
  }

  ctx.scene.reenter()
})

export default live
