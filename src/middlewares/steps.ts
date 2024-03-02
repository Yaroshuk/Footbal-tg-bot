// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { IMyContext } from '../types'

export default async (ctx: IMyContext, next: Function) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (ctx.message?.text === '/back' || !ctx.scene.current?.id) {
    return next()
  }

  if (!ctx.session?.steps?.length) {
    ctx.session.steps = [
      {
        scene: ctx.scene.current?.id ?? '',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        command: ctx.message.text ?? '',
      },
    ]

    return next()
  }

  if (ctx.session.steps[ctx.session.steps.length - 1].scene === ctx.scene.current?.id) {
    return next()
  }

  const newSteps = [
    ...ctx.session.steps.slice(-2),
    {
      scene: ctx.scene.current?.id ?? '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      command: ctx.message.text ?? '',
    },
  ]

  ctx.session.steps = newSteps

  return next()
}
