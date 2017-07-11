import { REGEX_COMPONENT_SYSTEM_NAME } from '../constant/constants.js';
import { Spec } from 'js-spec';

export default  {
    renderEngine: Spec.shape({
        name: Spec.match(REGEX_COMPONENT_SYSTEM_NAME),
        api: Spec.object,
    }),
    interface: Spec.shape({
        createElement: Spec.func,
        defineFunctionalComponent: Spec.func,
        defineStandardComponent: Spec.func,
        isElement: Spec.func
    }),
    options: Spec.optional(Spec.shape({
        isBrowserBased: Spec.optional(Spec.boolean)
    }))
};
