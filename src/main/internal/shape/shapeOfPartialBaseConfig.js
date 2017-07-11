import { Spec } from 'js-spec';

import { REGEX_COMPONENT_NAME, REGEX_PROPERTY_NAME }
    from '../constant/constants.js';

export default {
    displayName: 
        Spec.match(REGEX_COMPONENT_NAME),

    properties:
        Spec.optional(
            Spec.or(
                Spec.and(
                    Spec.array,
                    Spec.size(Spec.greater(0)),
                    Spec.values(Spec.match(REGEX_PROPERTY_NAME)),
                    Spec.unique
                ),
                Spec.and(
                    Spec.keys(
                        Spec.match(REGEX_PROPERTY_NAME)),
                    Spec.values(
                        Spec.shape({
                            type:
                                Spec.optional(Spec.func),
                            nullable:
                                Spec.optional(Spec.boolean),
                            constraint:
                                Spec.optional(Spec.func),
                            defaultValue:
                                Spec.any,
                            inject:
                                Spec.optional(Spec.boolean)
                        }))))),
};
