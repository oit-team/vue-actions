import { defineComponent } from 'vue'
import { Actions } from './actions'
import { registerComponent, unregisterComponent } from './utils'

export default defineComponent({
  name: 'VueActions',

  onRecords: null,

  props: {
    data: null,
  },

  data() {
    return {
      actions: null as Actions | null,
      isActive: false,
    }
  },

  created() {
    registerComponent(this)
    // 避免被转换为响应式对象
    Object.defineProperty(this.$data, 'actions', {
      value: new Actions(),
      writable: true,
    })
  },

  activated() {
    this.isActive = true
    this.actions!.restart()
  },

  deactivated() {
    this.emitRecords()
  },

  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  destroyed() {
    !this.isActive && this.emitRecords()
    unregisterComponent(this)
  },

  methods: {
    emitRecords() {
      const records = this.getRecords()
      this.$options.onRecords?.(records, this.data)
      this.$emit('records', records)
    },
    getRecords() {
      return this.actions?.getRecords()
    },
  },

  render(h) {
    return h('div', {
      attrs: {
        'data-actions-component': true,
      },
    }, this.$slots.default)
  },
})
