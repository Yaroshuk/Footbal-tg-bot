export const BASE_URL = 'http://api.football-data.org/v4/'

// TODO: перенести команды по файлам
export const MESSAGE_TO_DATE_MAP: { [key: string]: string; default: string } = {
  'На сегодня': 'TODAY',
  'На завтра': 'TOMORROW',
  'На неделю': 'WEEK',
  default: 'TODAY',
}

export const DATE_TO_MESSAGE_MAP: { [key: string]: string; default: string } = {
  TODAY: 'На сегодня',
  TOMORROW: 'На завтра',
  WEEK: 'На неделю',
  default: '',
}

export const MESSAGE_TO_LEADUE_MAP: { [key: string]: string; default: string } = {
  'Премьер Лига': 'PL',
  'Лига чемпионов': 'CL',
  БундесЛига: 'BL1',
  default: 'PL',
}

export const MESSAGE_TO_COMMAND_MAP: { [key: string]: string; default: string } = {
  'Изменить дату': 'RESTART',
  Меню: 'MENU',
  default: '',
}
