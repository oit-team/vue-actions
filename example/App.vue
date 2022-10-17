<script>
import { defineComponent, nextTick } from 'vue'
import {
  component as VueActions,
  directive as actions,
} from '../src'

const Test = defineComponent({
  render(h) {
    return h('div', 'test component')
  },
})

const Test2 = defineComponent({
  components: { Test },
  directives: { actions },
  render(h) {
    return h(
      'div',
      {
        directives: [
          {
            name: 'actions',
            arg: 'foo',
            modifiers: {
              click: true,
              duration: true,
            },
          },
        ],
      },
      [h(Test)],
    )
  },
})

export default defineComponent({
  components: {
    Test,
    Test2,
    VueActions,
  },

  directives: {
    actions,
  },

  data: () => ({
    message: 'Hello World!',
    show: false,
  }),

  mounted() {
  },

  methods: {
    test(records) {
      console.log(records)
    },
  },
})
</script>

<template>
  <div id="app">
    <button @click="show = !show">
      test
    </button>
    <VueActions v-if="show" @records="test">
      <div :style="{ position: 'absolute' }">
        <Test />
        <Test2 />
        <button ref="test" v-actions:submit.click.duration>
          button
        </button>
      </div>
    </VueActions>
  </div>
</template>
