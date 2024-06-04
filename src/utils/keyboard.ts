import { Markup } from 'telegraf'
import { ISearchResult, Pagination } from '../types'

export const mainKeyboard = Markup.keyboard([['Расписание матчей', 'Лайв матчи'], ['Сделать ставку']])
  .resize()
  .oneTime(true)

// export const matchesKeyboard = Markup.keyboard([['Премьер Лига', 'Лига Чемпионов', 'Бундеслига'], ['На главную']])

export const dateKeyboard = () => {
  return Markup.keyboard([
    [
      Markup.button.callback('На сегодня', 'date-TODAY', false),
      Markup.button.callback('На завтра', 'date-TOMORROW', false),
      Markup.button.callback('На неделю', 'date-WEEK', false),
      Markup.button.callback('На 2 недели', 'date-2WEEK', false),
    ],
  ]).resize()
}

export const matchesKeyboard = () => {
  return Markup.keyboard([
    [
      Markup.button.callback('Премьер Лига', 'match-PL', false),
      Markup.button.callback('Лига чемпионов', 'match-CL', false),
      Markup.button.callback('БундесЛига', 'match-BL1', false),
      Markup.button.callback('Лига Европы', 'match-EC', false),
    ],
  ]).resize()
}

export const additionalMatchesKeyboard = () => {
  return Markup.keyboard([
    [
      Markup.button.callback('Премьер Лига', 'match-PL', false),
      Markup.button.callback('Лига чемпионов', 'match-CL', false),
      Markup.button.callback('БундесЛига', 'match-BL1', false),
      Markup.button.callback('Лига Европы', 'match-EC', false),
    ],
    [
      Markup.button.callback('Изменить дату', 'action-RESTART', false),
      Markup.button.callback('Меню', 'action-MENU', false),
    ],
  ]).resize()
}

export const backKeyboard = Markup.keyboard([['Назад']])

export const resultKeyboard = (books: ISearchResult[], pagination: Pagination) => {
  const result = books.map((item) => {
    return [Markup.button.callback(`${item.title} [${item.author}]`, `book-${item.src}`, false)]
  })

  return Markup.inlineKeyboard([...result, getPaginationButtons(pagination)])
}

const getPaginationButtons = (pagination: Pagination) => {
  if (pagination.last === 1) return []

  if (pagination.last <= 5) {
    return new Array(pagination.last).fill(0).map((elem, index) => {
      const title = index + 1 === pagination.current ? `[${++index}]` : `${++index}`
      return Markup.button.callback(title, `${++index}`)
    })
  }

  const result = [
    Markup.button.callback('<<', '<<'),
    Markup.button.callback('<', '<'),
    Markup.button.callback(`${pagination.current}`, `${pagination.current}`),
    Markup.button.callback('>', '>'),
    Markup.button.callback('>>', '>>'),
  ]

  return result
}
