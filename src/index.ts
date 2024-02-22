/**/
import 'dotenv/config'
import { Telegraf, Scenes, session } from 'telegraf'
import { start, matches } from './scenes'
import { IMyContext } from './types'
import { mainKeyboard } from './utils/keyboard'

function main() {
  const bot = new Telegraf<IMyContext>(process.env.TM_TOKEN!)

  const stage = new Scenes.Stage<IMyContext>([start, matches])

  bot.use(session())
  bot.use(stage.middleware())

  bot.start((ctx) => ctx.scene.enter('Start'))

  bot.hears('Расписание матчей', (ctx) => ctx.scene.enter('Matches'))

  bot.hears('Назад', (ctx) => {
    ctx.reply('Что дальше?', mainKeyboard)
  })

  bot.launch()
}

main()
