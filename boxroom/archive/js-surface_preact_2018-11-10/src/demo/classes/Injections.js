import { createElement as h, defineComponent, defineContext } from 'js-surface'
import { Component } from 'js-surface/classes'
import { Spec } from 'js-spec'

const
  nopLogger = {
    log() {}
  },

  consoleLogger = {
    log(...args) {
      console.log(...args)
    }
  },
  
  LoggerCtx = defineContext({
    displayName: 'LoggerCtx',
    defaultValue: nopLogger
  })

const Counter = defineComponent({
  displayName: 'Counter',

  properties: {
    label: {
      type: String,
      nullable: true,
      defaultValue: null
    },

    initialValue: {
      type: Number,
      validate: Spec.integer,
      defaultValue: 0
    },

    logger: {
      type: Object,
      optional: true,

      inject: {
        context: LoggerCtx
      }
    }
  },

  main: class extends Component {
    constructor(props) {
      super(props)

      props.logger.log('Instantiating new component')

      this.state = { counter: props.initialValue }
      this.onClickDecrement = this.onClickDecrement.bind(this)
      this.onClickIncrement = this.onClickIncrement.bind(this)
    }

    onClickIncrement() {
      this.props.logger.log('Incrementing...')
      this.setState({ counter: this.state.counter + 1 })
    }

    onClickDecrement() {
      this.props.logger.log('Decrementing...')
      this.setState({ counter: this.state.counter - 1 })
    }

    render() {
      const
        { label } = this.props,
        { counter } = this.state

      return (
        h('div',
          label ? h('label', label) : null,
          ' ',
          h('button', { onClick: this.onClickDecrement }, ' - '),
          ` ${counter} `,
          h('button', { onClick: this.onClickIncrement }, ' + '))
      )
    }
  }
})

const InjectionsDemo = defineComponent({
  displayName: 'InjectionsDemo',

  render() {
    return (
      LoggerCtx.Provider(
        { value: consoleLogger },
        Counter({ label: 'Counter:' }))
    )
  }
})

export default InjectionsDemo()
