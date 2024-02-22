import { Telegraf } from 'telegraf'

class TelegramBot {
  private bot: Telegraf

  constructor(token: string) {
    this.bot = new Telegraf(token)
    this.bot.start((ctx) => ctx.reply('Welcome'))
  }

  launch() {
    this.bot.launch()
  }
}

export default TelegramBot
