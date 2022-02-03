# innstate

## The easiest state library, ever.

innstate is a fork of unstated-next with additional utilities and support. It aims to make to make state management in React intuitive and accessible.

# Install

```
yarn add @innatical/innstate
```

# FAQ

Q: Why?

A: Hooks are native to React, elegant, and make it easy to compose reactive systems. Using a wrapper around React context, innstate answers the question: What if we could have "global" React hooks? Rather than learning a new way to handle state, use the tools you already know how to use. In short, hooks + context = <3

Q: Why is everything rerenderng when I change a value that isn't depended on by that component?

A: You're probably using the useContainer method, this is mostly here to maintain compatability with unstated-next. Please use the useContainerSelector method instead, which will only cause a rerender when selected data changes.

Q: My question isn't answered here :(

A: Feel free to open an issue :)

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
