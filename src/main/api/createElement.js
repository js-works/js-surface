import convertIterablesToArrays from '../internal/helper/convertIterablesToArrays';

import preact from 'preact'

let
  VNode = preact.h('a').constructor, 
  ExtVNode = null // will be set later

export default function createElement(/* arguments */) {
  const
    argCount = arguments.length,
    type = arguments[0],
    secondArg = arguments[1],

    skippedProps = argCount > 1 && secondArg !== undefined && secondArg !== null
        && (typeof secondArg !== 'object' || secondArg instanceof VNode
          || typeof secondArg[Symbol.iterator] === 'function'),

    hasChildren = argCount > 2 || argCount === 2 && skippedProps

  let children = null

  if (hasChildren) {
    const
      firstChildIdx = 1 + !skippedProps,
      childCount = argCount - firstChildIdx

    children = new Array(childCount)

    for (let i = 0; i < childCount; ++i) {
      children[i] = arguments[firstChildIdx + i]
    }

    children = convertIterablesToArrays(children) // TODO: Optimize
  }

  let props = null

  if (hasChildren && !skippedProps) {
    if (secondArg === undefined || secondArg === null) {
      props = { children }
    } else {
      props = {}
        
      const
        keys = Object.keys(secondArg),
        keyCount = keys.length

      for (let i = 0; i < keyCount; ++i) {
        const key = keys[i]

        props[key] = secondArg[key]
      }

      props.children = children
    }
  } else if (hasChildren && skippedProps) {
    props = { children }
  } else if (!hasChildren && argCount === 2) {
    props = secondArg || null
  }

  const internalType = arguments[0].__internal_type || arguments[0]

  if (!ExtVNode) {
    ExtVNode = {
      VirtualElement() { // to make sure it's called "VirtualElement" even if minified
      }
    }.VirtualElement

    ExtVNode.prototype = Object.create(VNode.prototype, {
      nodeName: {
        enumerable: false,

        get: function () {
          return this.internal.nodeName
        }
      },

      attributes: {
        enumerable: false,

        get: function () {
          return this.internal.attributes
        }
      },

      children: {
        enumerable: false,

        get: function () {
          return this.internal.children
        }
      }
    })
  }



  const
    vnode = preact.h(internalType, props),
    
    internal = {
      nodeName: vnode.nodeName,
      attributes: vnode.attributes,
      children: vnode.children
    },
  
    ret = new ExtVNode()


  Object.defineProperty(ret, 'internal', {
    enumerable: false,
    value: internal
  })

  ret.type = type
  ret.key = !props ? null : props.key || null
  ret.ref = !props ? null : props.ref || null
  ret.props =  props

  if (props && (props.key || props.ref)) {
    ret.props = Object.assign({}, props) 
    delete ret.props.key
    delete ret.props.ref

    if (props.ref) {
      const ref = props.ref
      const preactRef = it => {
        let proxy = it && it.__proxy

        ref(proxy || it)
      }

      props.ref = preactRef
    }
  }

  return  ret
}
