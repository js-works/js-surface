import { createElement as h, defineComponent } from 'js-surface'
import { Component } from 'js-surface/classes'
import { Spec } from 'js-spec'

const Counter = defineComponent({
  displayName: 'Counter',

  properties: {
    initialValue: {
      type: Number,
      validate: Spec.integer,
      defaultValue: 0
    }
  },

  main: class extends Component {
    constructor(props) {
      super(props)

      this.state = { counter: props.initialValue }
      this.onIncrementClick = this.onIncrementClick.bind(this)
    }

    onIncrementClick() {
      this.setState(state => ({ counter: state.counter + 1 }))
    }

    render() {
      return (
        h('button',
          { onClick: this.onIncrementClick },
          'Counter: ' + this.state.counter)
      )
    }
  }
})

const Demo = defineComponent({
  displayName: 'Demo',

  render() {
    return (
      h('div',
        h('div', 'Please press the button to increase the counter'),
        Counter())
    )
  }
})

export default Demo()
