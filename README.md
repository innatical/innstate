# innstate

## The easiest state library, ever.

innstate is a fork of unstated-next with additional utilities and support. It aims to make to make state management in React accesable and accessible.

# Install

```
yarn add @innatical/innstate
```

# Full Example

```tsx
import React, { useCallback, useEffect, useState } from 'react'
import { createContainer } from '../src'
import { render } from 'react-dom'

const useCounter = (initialState = 0) => {
  const [count, setCount] = useState(initialState)
  const decrement = useCallback(() => setCount((count) => count - 1), [])
  const increment = useCallback(() => setCount((count) => count + 1), [])

  const [clock, setClock] = useState(0)
  const resetCLock = useCallback(() => setClock(0), [])

  useEffect(() => {
    const interval = setInterval(() => {
      setClock((time) => time + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return {
    count,
    decrement,
    increment,
    clock,
    resetCLock
  }
}

const Counter = createContainer(useCounter)

const CounterDisplay = () => {
  const counter = Counter.useContainer()
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}

const OtherCounterDisplay = () => {
  const clock = Counter.useContainerSelector((input) => ({
    time: input.clock,
    resetClock: input.resetCLock
  }))
  return (
    <div>
      <button onClick={clock.resetClock}>Reset Clock</button>
      <span>{clock.time}</span>
    </div>
  )
}

const App = () => {
  return (
    <Counter.Provider>
      <CounterDisplay />
      <OtherCounterDisplay />
    </Counter.Provider>
  )
}

render(<App />, document.getElementById('root'))
```
