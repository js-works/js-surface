import defineClassComponent from './defineClassComponent.js';
import defineDispatchComponent from './defineDispatchComponent.js';
import Component from './Component.js';
import adaptCreateElement from '../internal/component/adaption/adaptCreateElement.js';
import adaptIsRenderable from '../internal/component/adaption/adaptIsRenderable.js';

import { Spec } from 'js-spec';

import shapeOfAdaptComponentSystemConfig
    from './../internal/component/shape/shapeOfAdaptComponentSystemConfig.js';

export default function adaptComponentSystem(config) {
    const err = Spec.shape(shapeOfAdaptComponentSystemConfig)(config);

    if (err) {
        throw new Error(
            "Illegal first argument 'config' for "
            + "function 'adaptComponentSystem':"
            + err);
    }
    
    const createElement = config.isBrowserBased === false
        ? config.createElement
        : adaptCreateElement(config.createElement, config.isElement);

    return {
        createElement,
        defineClassComponent,
        defineDispatchComponent,
        defineFunctionalComponent: config.defineFunctionalComponent,
        defineStandardComponent: config.defineStandardComponent,
        isElement: config.isElement,
        isRenderable: adaptIsRenderable(config.isElement),
        render: config.render,
        Component
    };
}