import preactContext from 'preact-context'
import validateContextConfig from '../internal/validation/validateContextConfig'
import printError from '../internal/helper/printError'
import validateProperty from '../internal/validation/validateProperty'
import createElement from './createElement'

export default function defineContext(config) {
  if (process.env.NODE_ENV === 'development') {
    const error = validateContextConfig(config)

    if (error) {
      const errorMsg = prettifyErrorMsg(error.message, config)

      printError(errorMsg)
      throw new TypeError(errorMsg)
    }
  }

  const
    internalContext = preactContext.createContext(config.defaultValue),
    internalProvider = internalContext.Provider,
    internalConsumer = internalContext.Consumer,

    Provider = function (...args) {
      return createElement(Provider, ...args)
    },

    Consumer = (...args) => {
      return createElement(Consumer, ...args)
    }
  
  if (process.env.NODE_ENV === 'development') {
    internalContext.Provider.propTypes = {
      value: props => {
        const result = validateProperty(props.value, 'value', config)

        return !result
          ? null
          : new Error(`Error while providing context "${config.displayName}": `
            +  result.message)
      }
    }
  }

  Object.defineProperty(Provider, '__internal_type', {
    enumerable: false,
    value: internalProvider
  })

  Object.defineProperty(Consumer, '__internal_type', {
    enumerable: false,
    value: internalConsumer
  })

  Object.defineProperty(Consumer, '__internal_isConsumer', {
    enumerable: false,
    value: true
  })

  const ret = { Provider, Consumer }

  Object.defineProperty(ret, '__internal_context', {
    enumerable: false,
    value: internalContext,
  })

  return Object.freeze(ret)
}

function prettifyErrorMsg(errorMsg, config) {
  return config && typeof config === 'object'
    && typeof config.displayName === 'string'
    && config.displayName.trim().length > 0
    ? '[defineContext] Invalid configuration for context '
      + `"${config.displayName}": ${errorMsg} `
    : `[defineContext] Invalid context configuration: ${errorMsg}`
}