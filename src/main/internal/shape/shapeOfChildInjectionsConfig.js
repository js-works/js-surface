import { REGEX_INJECTION_NAME } from '../constant/constants.js'; 
import { Spec } from 'js-spec';

export default {
    childInjections:
        Spec.optional(
            Spec.or(
                Spec.and(
                    Spec.array,
                    Spec.size(Spec.greater(0)),
                    Spec.valuesOf(Spec.match(REGEX_INJECTION_NAME)),
                    Spec.unique
                ),
                Spec.and(
                    Spec.keysOf(
                        Spec.match(REGEX_INJECTION_NAME)),
                    Spec.valuesOf(
                        Spec.shape({
                            type:
                                Spec.optional(Spec.func),
                            nullable:
                                Spec.optional(Spec.boolean),
                            constraint:
                                Spec.optional(Spec.func)
                        }))))),
};
