import { Context, Scenes } from 'telegraf'
import { IMyContext } from '../types'
import { mainKeyboard } from '../utils/keyboard'

const start = new Scenes.BaseScene<IMyContext>('Start')

start.enter(async (ctx: Context) => {
  await ctx.reply('Привет! Тут ты найдешь лайф результаты, результаты и расписание футбольных матчей', mainKeyboard)
})

export default start
