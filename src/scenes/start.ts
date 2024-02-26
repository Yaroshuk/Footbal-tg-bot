import { Context, Scenes } from 'telegraf'
import { IMyContext } from '../types'
import { mainKeyboard } from '../utils/keyboard'
import User from '../models/User'

const start = new Scenes.BaseScene<IMyContext>('Start')

start.enter(async (ctx: Context) => {
  const uid = String(ctx.from!.id)
  const user = await User.findById(uid)

  if (user) {
    await ctx.reply('Что дальше?', mainKeyboard)
  } else {
    const now = new Date().getTime()

    const newUser = new User({
      _id: uid,
      created: now,
      username: ctx.from!.username,
      name: ctx.from!.first_name + ' ' + ctx.from!.last_name,
      lastActivity: now,
      role: 'USER',
    })

    await newUser.save()
    await ctx.reply('Привет! Тут ты найдешь лайф результаты, результаты и расписание футбольных матчей', mainKeyboard)
  }
})

export default start
