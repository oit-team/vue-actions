export interface ActionsItem {
  // 点击次数
  click?: number
  // 停留时间
  duration?: number
}

export interface ActionsData {
  duration: number
  records: Record<string, ActionsItem>
}

const MAIN = '__MAIN__'

export class Actions {
  data: ActionsData = {
    duration: 0,
    records: {},
  }

  timer: Record<string, number> = {}

  observer: IntersectionObserver

  observerMaps?: WeakMap<HTMLElement, IntersectionObserver>

  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // console.log(entry)

        const actionName = (entry.target as HTMLElement).dataset.actionName
        if (!actionName)
          return

        entry.isIntersecting
          ? this.startTime(actionName)
          : this.recordTime(actionName, this.endTime(actionName))
      })
    }, {
      root: document.body,
      threshold: [0.01, 0.1],
    })
  }

  restart() {
    this.startTime(MAIN)
  }

  register(target: HTMLElement, name: string, actions: keyof ActionsItem | Array<keyof ActionsItem>) {
    actions = Array.isArray(actions) ? actions : [actions]

    this.data.records[name] = {
      click: 0,
      duration: 0,
    }

    target.dataset.actionName = name

    if (actions.includes('click'))
      this.watchClick(target, name)

    if (actions.includes('duration'))
      this.watchDuration(target)
  }

  watchClick(target: HTMLElement, name: string) {
    target.addEventListener('click', () => {
      this.data.records[name].click!++
    })
  }

  watchDuration(target: HTMLElement) {
    this.getObserver(target)?.observe(target)
  }

  private findPositionElement(el: HTMLElement) {
    let target = el
    while (target) {
      if (!['static', 'relative'].includes(getComputedStyle(target).position))
        return target

      target = target.parentElement as HTMLElement
    }
    return null
  }

  private getObserver(target: HTMLElement) {
    const root = this.findPositionElement(target)

    if (!root)
      return

    let obs = this.observerMaps?.get(root)

    if (!obs) {
      obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // console.log(entry)

          const actionName = (entry.target as HTMLElement).dataset.actionName
          if (!actionName)
            return

          entry.isIntersecting
            ? this.startTime(actionName)
            : this.recordTime(actionName, this.endTime(actionName))
        })
      }, {
        root,
        threshold: [0.01, 0.1],
      })

      this.observerMaps?.set(root, obs)
    }

    return obs
  }

  private startTime(name: string) {
    if (!this.hasTime(name))
      this.timer[name] = Date.now()
  }

  private endTime(name: string, next = false) {
    const time = (Date.now() - this.timer[name]) || 0
    !next && delete this.timer[name]
    return time
  }

  private hasTime(name: string) {
    return !!this.timer[name]
  }

  private recordTime(name: string, time: number) {
    this.data.records[name].duration! += time
  }

  reset() {
    Object.keys(this.data.records).forEach((key) => {
      this.data.records[key] = {
        click: 0,
        duration: 0,
      }
    })
  }

  getRecords() {
    // TODO: Type fix
    const data: {
      duration: number
      records: Array<{
        name: string
        actions: ActionsItem
      }>
    } = {
      duration: 0,
      records: [],
    }

    data.duration = this.endTime(MAIN)
    data.records = Object.keys(this.data.records).map((key) => {
      if (this.hasTime(key))
        this.data.records[key].duration = this.endTime(key)

      return {
        name: key,
        actions: this.data.records[key],
      }
    })

    this.reset()
    return data
  }
}
