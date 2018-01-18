import adaptComponentClass from './adapt/adaptComponentClass';
import adaptCreateElement from './adapt/adaptCreateElement';
import adaptHyperscript from './adapt/adaptHyperscript';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import adaptMount from './adapt/adaptMount.js';
import unmount from './component/unmount.js';
import Config from './config/Config';
import ElementInspector from './helper/ElementInspector';

import React from 'react';
import ReactDOM from 'react-dom';

const
    defineComponent = adaptReactifiedDefineComponent({
        createElement: React.createElement,
        ComponentClass: React.Component
    }),

    createElement = adaptCreateElement({
        createElement: React.createElement,
        isElement: React.isValidElement,
        classAttributeName: 'className',
        attributeAliases: null,
        attributeAliasesByTagName: null,
        argumentsMapper: null
    }),

    hyperscript = adaptHyperscript({
        createElement: React.createElement,
        isElement: React.isValidElement,
        classAttributeName: 'className',
        attributeAliases: null,
        attributeAliasesByTagName: null,
        argumentsMapper: null
    }),

    isElement = React.isValidElement,

    reactMount = (content, targetNode) => {
        ReactDOM.render(content, targetNode);

        return () => ReactDOM.unmountComponentAtNode(targetNode);
    },

    mount = adaptMount(reactMount, isElement),

    Adapter = Object.freeze({
        name: 'react',
        api: { React, ReactDOM }
    }),

    inspectElement = obj => {
        let ret = null;

        if (React.isElement(obj)) {
            ret = new ElementInspector(obj.type, obj.props);
        }

        return ret;
    },
    
    Component = adaptComponentClass(defineComponent);

export {
    createElement,
    defineComponent,
    hyperscript,
    inspectElement,
    isElement,
    mount,
    unmount,
    Adapter,
    Component,
    Config
};
