import VirtualElement from '../internal/element/VirtualElement'
import validateProperties from '../internal/validation/validateProperties'

import {
  KEY_INTERNAL_TYPE,
  KEY_INTERNAL_DEFAULTS,
  KEY_INTERNAL_IS_CTX_PROVIDER
} from '../internal/constant/constants'

export default function createElement(/* arguments */) {
  const
    argCount = arguments.length,
    type = arguments[0],
    secondArg = arguments[1],

    skippedProps = secondArg !== undefined && secondArg !== null
      && (typeof secondArg !== 'object' || !!secondArg[Symbol.iterator]
        || secondArg instanceof VirtualElement)

  let
    props = skippedProps ? null : secondArg,
    children = null

  if (argCount > 2 || argCount === 2 && skippedProps) {
    const firstChildIdx = skippedProps ? 1 : 2

    let lastChildWasString = false

    children = []

    for (let i = firstChildIdx; i < argCount; ++i) {
      const item = arguments[i]

      if (item === null || typeof item !== 'object') {
        const child =
          item === undefined || item === null  || item === true || item === false
            ? ''
            : '' + item

        if (lastChildWasString) {
          if (item.length > 0) {
            children[children.length - 1] += child
          }
        } else {
          children.push(child)
          lastChildWasString = true
        }
      } else if (item instanceof VirtualElement) {
        children.push(item)
      } else {
        addFlattened(children, item)
      }
    }
  }

  const internalType = type[KEY_INTERNAL_TYPE]

  if (internalType) {
    const defaults = internalType[KEY_INTERNAL_DEFAULTS]
 
    if (defaults) {
      for (let i = 0; i < defaults.length; ++i) {
        const [propName, getDefault] = defaults[i]

        props = props || {}

        if (props[propName] === undefined) {
          props[propName] = getDefault()
        }
      }
    }
  }
 
  if (process.env.NODE_ENV === 'development' && internalType) {
    const
      meta = type.meta || null,
      isCtxProvider = !!type[KEY_INTERNAL_IS_CTX_PROVIDER],
      propsConfig = meta === null ? null : meta.properties || null
  
    if (typeof type === 'function' && meta) {
      const
        componentName = meta ? meta.displayName : null,
        propsValidator = meta.validate || null

      if (meta) {
        const result = validateProperties(
          props, propsConfig, propsValidator, componentName, isCtxProvider)

        if (result) {
          throw result
        }
      }
    }
  }

  return new VirtualElement(type, props, children)
}

// --- locals -------------------------------------------------------

function addFlattened(array, item) {
  if (item === null || typeof item !== 'object') {
    const child =
      item === undefined || item === null || item === true || item === false
        ? ''
        : '' + item

    const arrayLength = array.length

    if (arrayLength > 0 && typeof array[arrayLength - 1] === 'string') {
      array[arrayLength - 1] += child
    } else {
      array.push(child)
    }
  } else if (Array.isArray(item)) {
    for (let i = 0; i < item.length; ++i) {
      addFlattened(array, item[i])
    }
  } else if (item[Symbol.iterator]) {
    for (const x of item) {
      addFlattened(array, x)
    }
  } else {
    array.push(item)
  }
}
