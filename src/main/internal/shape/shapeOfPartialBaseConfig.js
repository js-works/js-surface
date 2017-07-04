import { Spec } from 'js-spec';

import { REGEX_COMPONENT_NAME, REGEX_PROPERTY_NAME }
    from '../constant/constants.js';

export default {
    displayName: 
        Spec.matches(REGEX_COMPONENT_NAME),

    properties:
        Spec.optional(
            Spec.or(
                Spec.and(
                    Spec.array,
                    Spec.values(Spec.matches(REGEX_PROPERTY_NAME)),
                    Spec.unique
                ),
                Spec.and(
                    Spec.keys(
                        Spec.matches(REGEX_PROPERTY_NAME)),
                    Spec.values(
                        Spec.shape({
                            type:
                                Spec.func,
                            constraint:
                                Spec.optional(Spec.func),
                            defaultValue:
                                Spec.any,
                            inject:
                                Spec.optional(Spec.boolean)
                        }))))),
};
