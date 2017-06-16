import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError.js';

import shapeOfStandardComponentConfig
    from '../shape/shapeOfStandardComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
    const error =
        Spec.hasShapeOf(shapeOfStandardComponentConfig)(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}