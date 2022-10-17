import { nextTick } from 'vue'
import { getActionsComponent } from './utils'
import type { DirectiveOptions } from 'vue'

function checkActionsKey(arr: Array<string>) {
  return arr.some((key) => {
    const checked = !['click', 'duration'].includes(key)
    if (checked)
      console.error(`Invalid action: ${key}`)
    return checked
  })
}

const directive: DirectiveOptions = {
  async bind(el, binding) {
    await nextTick()
    const actionsComponent = getActionsComponent(el)
    const actionName = binding.arg

    if (!actionsComponent)
      return console.warn('actions component not found')
    if (!actionName)
      return console.warn('actions name not defined')

    const { actions } = actionsComponent

    if (!actions)
      return

    if (checkActionsKey(Object.keys(binding.modifiers)))
      return

    actions.register(el, actionName, Object.keys(binding.modifiers) as any)
  },

  unbind(el) {
    console.log(el)
  },
}

export default directive
