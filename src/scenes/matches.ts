import { Context, Scenes } from 'telegraf'
import axios from 'axios'
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
import { steps } from '../middlewares'
import { Resvg } from '@resvg/resvg-js'

const matches = new Scenes.BaseScene<IMyContext>('Matches')

matches.enter(async (ctx: Context) => {
  await ctx.reply('Расписание футбольных матчей', dateKeyboard())
})

// ACTIONS DATE
matches.hears(['На сегодня', 'На завтра', 'На неделю', 'На 2 недели'], steps, async (ctx) => {
  const message = ctx.message.text

  ctx.session.date = MESSAGE_TO_DATE_MAP[message] ?? MESSAGE_TO_DATE_MAP.default

  await ctx.reply(`Расписание матчей ${message.toLowerCase()}`, matchesKeyboard())
})

// ACTIONS MATCHES
matches.hears(['Премьер Лига', 'Лига чемпионов', 'БундесЛига', 'Лига Европы'], steps, async (ctx, next) => {
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
    // console.log('MATCG', match)
    const caption = `<b>${match.homeTeam.shortName} (дома)</b>   🆚   <b>${
      match.awayTeam.shortName
    } (в гостях)</b>\n\n${match?.date ? `⏳ ${DateTime.fromISO(match?.date).toFormat('T dd-LL-yyyy\n\n')}` : ''}`

    let homeImg = match.homeTeam.crest
    let awayImg = match.awayTeam.crest

    // TODO: refactor
    if (String(homeImg).includes('.svg')) {
      try {
        const response = await axios(match.homeTeam.crest, {
          headers: {
            'X-Auth-Token': process.env.API_TOKEN!,
          },
        })

        if (response.status === 200) {
          const result = response.data

          console.log('rre', result)

          const resvg = new Resvg(result, { fitTo: { mode: 'width', value: 200 } })
          homeImg = { source: resvg.render().asPng() }
        }
      } catch (error) {
        throw new Error(`SVG HOME Error: ${error}`)
      }
    }

    if (String(awayImg).includes('.svg')) {
      try {
        const response = await axios(match.awayTeam.crest, {
          headers: {
            'X-Auth-Token': process.env.API_TOKEN!,
          },
        })

        if (response.status === 200) {
          const result = response.data

          const resvg = new Resvg(result, { fitTo: { mode: 'width', value: 200 } })
          awayImg = { source: resvg.render().asPng() }
        }
      } catch (error) {
        throw new Error(`SVG AWAY Error: ${error}`)
      }
    }

    try {
      await ctx.replyWithMediaGroup([
        {
          type: 'photo',
          media: homeImg,
          parse_mode: 'HTML',
          caption,
        },
        { type: 'photo', media: awayImg },
      ])
    } catch (error) {
      console.log('SVG error', error)
    }
  }

  await ctx.reply(
    `Расписание матчей на ${DATE_TO_MESSAGE_MAP[ctx.session.date ?? ''].toLowerCase()}`,
    additionalMatchesKeyboard()
  )
})

// ACTIONS OTHERS
matches.hears(['Изменить дату', 'Меню'], steps, async (ctx) => {
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

export default matches
