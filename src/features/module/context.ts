import React from "react"

export interface IContextGeneratorOptions<T> {
  selector?: (value: T) => any
  displayName?: string
  defaultValue: T
}

/**
 * Create typed context.
 * @example
 * const [typedContext, useTypedContextValue] = createContext({
 *  defaultValue: null,
 *  displayName: 'DEBUG CONTEXT NAME', // optional
 *  selector: (contextValue) => [contextValue, additionalValue], // optional
 * })
 * 
 * const [contextValue, additionalValue] = useTypedContextValue()
 * 
 * 
 * @param options Config settings.
 * @returns [Context, useTypedHook].
 */
export function createContext<T>(options: IContextGeneratorOptions<T>) {
  const context = React.createContext<T>(options.defaultValue)
  context.displayName = options.displayName

  function useTypedContextValue() {
    const contextValue = React.useContext(context)
    
    return options.selector ? options.selector(contextValue) : contextValue
  }

  return [context, useTypedContextValue]
}
