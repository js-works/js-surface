import {
  h,
  component,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from '../../main/index'

const Counter = component({
  name: 'Counter',
  forwardRef: true,

  main({ initialValue = 0, label = 'Counter', ref }) {
    const
      [count, setCount] = useState(() => initialValue),
      onIncrement = useCallback(() => setCount(count + 1), [count]),
      onDecrement = useCallback(() => setCount(count - 1), [count])

    useImperativeHandle(ref, () => ({
      reset(n) {
        setCount(n)
      }
    }), [])

    return (
      <div>
        <label>{label}: </label>
        <button onClick={onDecrement}>-</button>
        {` ${count} `}
        <button onClick={onIncrement}>+</button>
      </div>
    )
  }
})

const App = component({
  name: 'App',

  main() {
    const
      counterRef = useRef(),
      onResetTo0 = useCallback(() => counterRef.current.reset(0)),
      onResetTo100 = useCallback(() => counterRef.current.reset(100))

    return (
      <div>
        <Counter ref={counterRef}/>
        <br/>
        <div>
          <button onClick={onResetTo0}>Set to 0</button>
          {' '}
          <button onClick={onResetTo100}>Set to 100</button>
        </div>
      </div>
    )
  }
})

export default <App/>
