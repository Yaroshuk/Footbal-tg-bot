import { Context, Scenes } from 'telegraf'
import { DateTime } from 'luxon'
import { matchesKeyboard, dateKeyboard, additionalMatchesKeyboard } from '../utils/keyboard'
import { IMyContext } from '../types'
import { getMatches } from '../services/matches'
import {
  DATE_TO_MESSAGE_MAP,
  MESSAGE_TO_COMMAND_MAP,
  MESSAGE_TO_DATE_MAP,
  MESSAGE_TO_LEADUE_MAP,
} from '../constants/api'

const matches = new Scenes.BaseScene<IMyContext>('Matches')

matches.enter(async (ctx: Context) => {
  ctx.reply('Расписание футбольных матчей', dateKeyboard())
})

// ACTIONS DATE
matches.hears(['На сегодня', 'На завтра', 'На неделю'], async (ctx) => {
  const message = ctx.message.text

  ctx.session.date = MESSAGE_TO_DATE_MAP[message] ?? MESSAGE_TO_DATE_MAP.default

  ctx.reply(`Расписание матчей ${message.toLowerCase()}`, matchesKeyboard())
})

// ACTIONS MATCHES
matches.hears(['Премьер Лига', 'Лига чемпионов', 'БундесЛига'], async (ctx) => {
  const message = ctx.message.text

  const league = MESSAGE_TO_LEADUE_MAP[message] ?? MESSAGE_TO_LEADUE_MAP.default

  ctx.reply(`Смотрим матчи для лиги - ${league}`)

  const result = await getMatches(league, ctx.session.date)

  if (!result || !result?.length) {
    ctx.reply('Упс, ничего не нашлось')
    await ctx.reply('Попробуй другие опции', additionalMatchesKeyboard())
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
    `Расписание матчей на ${DATE_TO_MESSAGE_MAP[ctx.session.date ?? ''].toLowerCase()}`,
    additionalMatchesKeyboard()
  )
})

// ACTIONS OTHERS
matches.hears(['Изменить дату', 'Меню'], async (ctx) => {
  const message = ctx.message.text

  const command = MESSAGE_TO_COMMAND_MAP[message] ?? MESSAGE_TO_COMMAND_MAP.default

  if (command === 'RESTART') {
    return ctx.scene.reenter()
  }

  if (command === 'MENU') {
    return ctx.scene.enter('Start')
  }

  ctx.scene.reenter()
})

// matches.action(/date/, async (ctx) => {
//   const data = ctx.callbackQuery.data
//   if (!data) return

//   const date = data.split('-')[1]

//   if (date === 'TOMORROW') {
//     ctx.session.isTomorrow = true
//   } else {
//     ctx.session.isTomorrow = false
//   }

//   ctx.reply(`Расписание матчей на ${ctx.session.isTomorrow ? 'завтра' : 'сегодня'}`, matchesKeyboard())
// })

// matches.action(/match/, async (ctx) => {
//   const data = ctx.callbackQuery.data
//   if (!data) return

//   const league = data.split('-')[1]

//   if (league) {
//     ctx.reply(`Смотрим матчи для лиги - ${league}`)

//     const result = await getMatches(league, ctx.session.isTomorrow ?? false)

//     if (!result || !result?.length) {
//       ctx.reply('Упс, ничего не нашлось')
//       return
//     }

//     const matches = [...result]

//     for (const match of matches) {
//       await ctx.replyWithHTML(`
//       ${match?.date ? `⏳ ${DateTime.fromISO(match?.date).toFormat('T dd-LL-yyyy\n\n')}` : ''}🏚 <b>${
//         match.homeTeam.shortName
//       } (${match.homeTeam.tla})</b>
//       \n🆚     \n\n🚌 <b>${match.awayTeam.shortName} (${match.awayTeam.tla})</b>\n\n`)
//     }

//     await ctx.reply(
//       `Расписание матчей на ${ctx.session.isTomorrow ? 'завтра' : 'сегодня'}`,
//       additionalMatchesKeyboard()
//     )
//     return
//   }

//   await ctx.scene.reenter()
// })

// matches.action(/action/, async (ctx) => {
//   const data = ctx.callbackQuery.data
//   if (!data) return

//   const date = data.split('-')[1]

//   if (date === 'RESTART') {
//     return ctx.scene.reenter()
//   }

//   if (date === 'MENU') {
//     return ctx.scene.enter('Start')
//   }

//   ctx.scene.reenter()
// })

export default matches
