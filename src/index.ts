import component from './component'
import type { ActionsData } from './actions'
export * from './actions'
export { default as directive } from './directive'
export { component }

export default {
  install(
    _Vue: any,
    options: {
      onRecords: (data: ActionsData) => void
    },
  ) {
    component.onRecords = options.onRecords
  },
}
