import { h, component, useCallback, useEffect, useState }
  from '../../main/js-surface'

import React from 'react'
import * as Dyo from 'dyo'

const
  r = React.h,
  d = Dyo.h,
  div = h.bind(null, 'div')

function runTests() {
  const
    iterationCount = 300000,
    tests = []

  let result = ''

  tests.push({
    name: 'Using h from React',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        r('div',
          { className: 'my-class', id: 'my-id', key: 1 },
          r('div',
            { className: 'my-class2', id: 'my-id2', key: 2},
            r('div', null, r('div', null, r('div', null, r('div')))),
            'some text', [1, 2, 3, 4, 5]))  
      }
    }
  }),
  
  tests.push({
    name: 'Using h from Dyo',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        d('div',
          { className: 'my-class', id: 'my-id', key: 1 },
          d('div',
            { className: 'my-class2', id: 'my-id2', key: 2},
            d('div', null, d('div', null, d('div', null, d('div')))),
            'some text', [1, 2, 3, 4, 5]))  
      }
    }
  }),
  
  tests.push({
    name: 'Using h from js-surface',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        h('div',
          { className: 'my-class', id: 'my-id', key: 1 },
          h('div',
            { className: 'my-class2', id: 'my-id2', key: 2 },
            h('div', null, h('div', null, h('div', null, h('div')))),
            'some text', [1, 2, 3, 4, 5]))  
      }
    }
  }),

  tests.push({
    name: 'Using HTML factories',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        div(
          { className: 'my-class', id: 'my-id', key: 1 },
          div({ className: 'my-class2', id: 'my-id2', key: 2},
            div(null, div(null, div(null, div()))),
            'some text', [1, 2, 3, 4, 5]))  
      }
    }
  })

  for (let i = 0; i < tests.length; ++i) {
    const
      test = tests[i],
      startTime = Date.now()
    
    test.run()

    const
      stopTime = Date.now(),
      duration = (stopTime - startTime) + ' ms'

    const message = `Run time for test '${test.name}': ${duration}`

    if (i == 0) {
      result = message
    } else {
      result += '\n' + message
    }
  }

  result += '\nAll tests finished.'

  return result
}

const PerformanceTest: any = component({ // TODO
  displayName: 'PerformanceTest',

  render() {
    const
      [result, setResult] = useState(() => null as string),
      [isRunning, setRunning] = useState(() => false),
      onStart = useCallback(() => startTest())

    function startTest() {
      setRunning(true)
    }

    useEffect(() => {
      if (isRunning) {
        const result = runTests()
        
        setRunning(false)
        setResult(result)
      }
    })

    return (
      <div> 
        <h4>Measuring time to build virtual dom trees</h4>
        { 
          !isRunning
            ? <div>
                <Report result={result}/> 
                <button onClick={onStart}>
                  { result === null ? 'Start tests' : 'Restart tests' }
                </button>
              </div>
            : <div>Running performance test - please wait...</div>
        }
      </div>
    )
  }
})

type ReportProps = {
  result: string
}

const Report: any = component<ReportProps>({ // TODO
  displayName: 'Report',

  render({ result }) {
    let ret = null
    
    if (result && result.trim().length > 0) {
      ret = <pre>{result}</pre>
    }

    return ret
  }
})

export default <PerformanceTest/>
