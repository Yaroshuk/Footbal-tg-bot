import { Context, Scenes } from 'telegraf'

export type Author = Record<'name' | 'link', string>

export type Pagination = Record<'current' | 'last', number>

// TODO: rename
export interface ISearchResult {
  title: string
  src: string
  author: Author
}

export interface ISearchResults {
  books: ISearchResult[]
  pagination: Pagination
}

export interface IBook {
  title: string
  img: string
  description: string
  author: Author
}

export interface ISession extends Scenes.SceneSession {
  searchResalt?: ISearchResults
  book?: IBook
}

export interface IMyContext extends Context {
  scene: Scenes.SceneContextScene<IMyContext>
  session: ISession
}
