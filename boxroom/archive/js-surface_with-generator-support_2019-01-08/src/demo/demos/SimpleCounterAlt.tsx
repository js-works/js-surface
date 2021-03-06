import { defineComponent } from '../../modules/core/main/index'
import { useState } from '../../modules/use/main/index'
import { button, div, label } from '../../modules/html/main/index'

interface SimpleCounterProps {
  label?: string,
  initialValue?: number
}

const SimpleCounter = defineComponent<SimpleCounterProps>({
  displayName: 'SimpleCounter',

  defaultProps: {
    label: 'Counter',
    initialValue: 0
  },

  init(c) {
    const
      [getCount, setCount] = useState(c, c.props.initialValue),
      onIncrement = () => setCount(getCount() + 1)

    return props => {
      return (
        div(null,
          label(null, props.label + ': '),
          button({ onClick: onIncrement }, getCount()))
      )
    }
  }
})

export default SimpleCounter()
