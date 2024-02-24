/**/
import 'dotenv/config'
import { Telegraf, Scenes, session, Markup } from 'telegraf'
import { start, matches, live } from './scenes'
import { IMyContext } from './types'

function main() {
  const bot = new Telegraf<IMyContext>(process.env.TM_TOKEN!)

  const stage = new Scenes.Stage<IMyContext>([start, matches, live])

  bot.use(session())
  bot.use(stage.middleware())

  bot.start((ctx) => ctx.scene.enter('Start'))

  bot.hears('Расписание матчей', (ctx) => ctx.scene.enter('Matches'))
  bot.hears('Лайв матчи', (ctx) => ctx.scene.enter('Live'))

  bot.hears('Сделать ставку', (ctx) =>
    ctx.reply(
      'Делай ставки на лучше лицензионно букмекере:',
      Markup.inlineKeyboard([[Markup.button.url('Сделать ставку', 'https://www.pari.ru/', false)]])
    )
  )

  bot.launch()
}

main()
