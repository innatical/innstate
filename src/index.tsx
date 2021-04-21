import React, { useEffect, useMemo, useRef } from 'react'
import {
  createSelectorProvider,
  useContextSelector
} from 'react-use-context-selector'
import { equal } from '@wry/equality'

const EMPTY: unique symbol = Symbol()

export interface ContainerProviderProps<State = void> {
  initialState?: State
  children: React.ReactNode
}

export interface Container<Value, State = void> {
  Provider: React.ComponentType<ContainerProviderProps<State>>
  useContainer: () => Value
  useContainerSelector: <T>(input: (input: Value) => T) => T
}

export const createContainer = <Value, State = void>(
  useHook: (initialState?: State) => Value
): Container<Value, State> => {
  const Context = React.createContext<Value | typeof EMPTY>(EMPTY)
  const ContextProvider = createSelectorProvider(Context)

  function Provider(props: ContainerProviderProps<State>) {
    const value = useHook(props.initialState)
    return <ContextProvider value={value}>{props.children}</ContextProvider>
  }

  const useContainer = (): Value => {
    const value = React.useContext(Context)
    if (value === EMPTY) {
      throw new Error('Component must be wrapped with <Container.Provider>')
    }
    return value
  }

  const useContainerSelector = <T,>(selector: (input: Value) => T): T => {
    const previousRef = useRef<T>()
    const value = useContextSelector(Context, (input) => {
      if (input === EMPTY) {
        throw new Error('Component must be wrapped with <Container.Provider>')
      }

      const selected = selector(input)

      if (equal(previousRef.current, selected)) {
        return previousRef.current
      } else {
        previousRef.current = selected
        return selected
      }
    })

    return value as T
  }

  return { Provider, useContainer, useContainerSelector }
}

export const useContainer = <Value, State = void>(
  container: Container<Value, State>
): Value => {
  return container.useContainer()
}

export const useContainerSelector = <Value, State = void>(
  container: Container<Value, State>,
  selector: <T>(input: Value) => T
) => {
  return container.useContainerSelector(selector)
}
