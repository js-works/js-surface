import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import InfernoCore from 'inferno';
import createInfernoElement from 'inferno-create-element';
import InfernoComponent from 'inferno-component';

const Inferno = Object.assign({}, InfernoCore, {
    createElement: createInfernoElement,
    Component: InfernoComponent    
});

// Get rid of internal functions
for (const key of Object.keys(Inferno)) {
    if (key.startsWith('internal')) {
        delete Inferno[key];
    }
}

const {
    createElement,
    defineComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    Adapter,
    Config
} = adaptReactLikeRenderEngine({
    renderEngineName: 'inferno',
    renderEngineAPI:  { Inferno },
    Component: Inferno.Component,
    createElement: Inferno.createElement,
    createFactory: customCreateFactory,
    isValidElement: customIsValidElement,
    mount: customMount
});

export {
    createElement,
    defineComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    Adapter,
    Config
};

// ------------------------------------------------------------------

function customCreateFactory(type) {
    return createElement.bind(null, type);
}

function customIsValidElement(it) {
    return it !== undefined && it !== null
        && (typeof it !== 'object' || !!(it.flags & (28 | 3970))); // 28: component, 3970: element
}

function customMount(content, targetNode) {
    Inferno.render(content, targetNode);

    return () => Inferno.render(null, targetNode);
}
