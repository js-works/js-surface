import {
  h,
  component,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  Ref
} from '../../main/js-surface'

type CounterProps = {
  label?: string,
  initialValue?: number,
  ref?: Ref<CounterMethods>
}

type CounterMethods = {
  reset(n: number): void
}

const Counter: any = component<CounterProps>({
  displayName: 'Counter',
  forwardRef: true,

  render({ initialValue = 0, label = 'Counter', ref }) {
    const
      [count, setCount] = useState(() => initialValue),
      onIncrement = useCallback(() => setCount(count + 1)),
      onDecrement = useCallback(() => setCount(count - 1))

    useImperativeHandle(ref, () => ({
      reset(n: number) {
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

const App: any = component({
  displayName: 'App',

  render() {
    const
      counterRef = useRef<CounterMethods>(),
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
