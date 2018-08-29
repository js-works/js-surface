import { Spec } from 'js-spec'

// --- the spec of the context configuration ------------------------

export default
  Spec.optional(
    Spec.shape({
      displayName:
        Spec.string,

      type:
        Spec.optional(
          Spec.function),

      constraint:
        Spec.optional(
          Spec.or(
            Spec.function,
            Spec.extensibleShape({
              validate: Spec.function
            })
          )),

      defaultValue:
         Spec.any
    }))