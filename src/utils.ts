import type Component from './component'

const actionsComponents: Array<InstanceType<typeof Component>> = []

export function registerComponent(component: InstanceType<typeof Component>) {
  actionsComponents.push(component)
}

export function unregisterComponent(component: InstanceType<typeof Component>) {
  const index = actionsComponents.indexOf(component)
  if (index > -1)
    actionsComponents.splice(index, 1)
}

export function getActionsComponent(el: HTMLElement) {
  return actionsComponents.find(component => component.$el.contains(el))
}
