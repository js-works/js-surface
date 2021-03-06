import Props from './types/Props'
import Methods from './types/Methods'
import PropertiesConfig from './types/PropertiesConfig'
import StatelessComponentConfig from './types/StatelessComponentConfig'
import StatelessComponentFactory from './types/StatelessComponentFactory'
import StatefulComponentConfig from './types/StatefulComponentConfig'
import StatefulComponentFactory from './types/StatefulComponentFactory'
import createElement from './createElement'
import { Spec } from 'js-spec'

function defineComponent<P extends Props = {} >(
  config: StatelessComponentConfig<P>): StatelessComponentFactory<P>

function defineComponent< P extends Props = {}, M extends Methods = {} >(
  config: StatefulComponentConfig<P, M>): StatefulComponentFactory<P, M>

function defineComponent(config: any): any {
  if (process.env.NODE_ENV === 'development' as any) {
    const error = validateComponentConfig(config)

    if (error) {
      throw new Error(
        `[defineComponent] ${error.message}`)
    }
  }

  let createComponentElement: Function = null

  const ret = function (/* arguments */) {
    return createComponentElement.apply(null, arguments)
  }
  
  createComponentElement = createElement.bind(null, ret)

  Object.defineProperty(ret, 'js-surface:kind', {
    value: 'componentFactory'
  })

  Object.defineProperty(ret, 'meta', {
    value: convertConfigToMeta(config)
  })

  return ret
}

export default defineComponent

// --- locals ---------------------------------------------------

const
  REGEX_DISPLAY_NAME = /^([a-z]+:)*[A-Z][a-zA-Z0-9.]*$/,
  REGEX_PROP_NAME = /^[a-z][a-zA-Z0-9]*$/,

  specOfPropertiesConfig =
    Spec.and(
      Spec.object,
      Spec.keysOf(Spec.match(REGEX_PROP_NAME)),

      Spec.valuesOf(
        Spec.and(
          Spec.strictShape({
            type: Spec.optional(Spec.function),
            nullable: Spec.optional(Spec.boolean),
            validate: Spec.optional(Spec.function),
            required: Spec.optional(Spec.boolean),
            defaultValue: Spec.optional(Spec.any)
          }),

          (propConfig: PropertiesConfig<any>) => {
            const
              required = propConfig.required,
              hasRequiredParam = propConfig.hasOwnProperty('required'),
              hasDefaultValue = propConfig.hasOwnProperty('defaultValue')

            let errorMsg = null

            if (hasRequiredParam && hasDefaultValue) {
              errorMsg = 'The parameters "required" and "defaultValue" must '
                + 'not be set both at once'
            } else if (required === false) {
              errorMsg = 'Please do not provide "required: false" as this is redundant'
            }

            return errorMsg ? new Error(errorMsg) : null
          }))),

  specOfDefaultProps =
    Spec.and(
      Spec.object,
      Spec.hasSomeKeys,
      Spec.keysOf(Spec.match(REGEX_PROP_NAME))),

  specOfStatelessComponentConfig = 
    Spec.strictShape({
      displayName: Spec.match(REGEX_DISPLAY_NAME),
      properties: Spec.optional(specOfPropertiesConfig),
      defaultProps: Spec.optional(specOfDefaultProps),
      variableProps: Spec.optional(Spec.boolean),
      validate: Spec.optional(Spec.function),
      render: Spec.function
    }),

  specOfStatefulComponentConfig = 
    Spec.strictShape({
      displayName: Spec.match(REGEX_DISPLAY_NAME),
      properties: Spec.optional(specOfPropertiesConfig),
      defaultProps: Spec.optional(specOfDefaultProps),
      variableProps: Spec.optional(Spec.boolean),
      validate: Spec.optional(Spec.function),

      methods:
        Spec.optional(
          Spec.and(
            Spec.arrayOf(Spec.string),
            Spec.unique())),

      init: Spec.function
    }),

  specOfComponentConfig =
    Spec.and(
      Spec.object,
      Spec.or(
        {
          when: Spec.prop('render', Spec.function),
          then: specOfStatelessComponentConfig 
        },
        {
          when: Spec.prop('init', Spec.function),
          then: specOfStatefulComponentConfig
        }
      ),
    (it => it.properties && it.defaultProps
      ? new Error('Not allowed to configure both parameters "properties" and "defaultProps" at once')
      : null))

function validateComponentConfig(config: any): null | Error {
  let ret = null
  const error = specOfComponentConfig.validate(config)

  if (error) {
    let errorMsg = 'Invalid configuration for component'

    if (config && typeof config.displayName === 'string'
      && config.displayName.match(REGEX_DISPLAY_NAME)) {

      errorMsg += ` "${config.displayName}"`
    }

    errorMsg += ` => ${error.message}`

    ret = new Error(errorMsg)
  }

  return ret
}

function convertConfigToMeta(config: any): any {
  const ret: any = {
    displayName: config.displayName
  }

  if (config.properties) {
    ret.properties = {}
    const keys = Object.keys(config.properties)

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]

      ret.properties[key] =
        Object.freeze(Object.assign({}, config.properties[key]))
    }
  }

  if (config.defaultProps) {
    const keys = Object.keys(config.defaultProps)

    ret.defaultProps = {}

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]

      ret.defaultProps[key] = config.defaultProps[key]
    }

    Object.freeze(ret.defaultProps)
  }

  if (config.render) {
    ret.render = config.render
  } else {
    ret.init = config.init

    if (config.methods) {
      ret.methods = Object.freeze(config.methods.slice(0))
    }
  }

  return Object.freeze(ret)
}
