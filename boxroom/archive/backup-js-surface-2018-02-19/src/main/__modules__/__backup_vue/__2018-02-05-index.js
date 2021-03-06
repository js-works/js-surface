import adaptDefineComponent from '../../adaption/adaptDefineComponentFunction';
import adaptMountFunction from '../../adaption/adaptMountFunction';

import Vue from 'vue';

const
    defineComponent = adaptDefineComponentFunction({
        BaseComponentClass: Component,
        adaptedCreateElementFunction: createElement,
        decorateComponentFunction,
        decorateComponentClass,
        defineStandardComponent,
        Fragment: 'x-fragment' // TODO
    }),

    createElement = (tag, props, ...children) => {
        let ret;
        
        if (tag && tag.meta) { // TODO: tag.meta checks for factory - find better solution!
            ret = tag(props, ...children);
        } else {
            ret = {
                type: tag,
                props,
                children,
                isSurfaceElement: true
            };
        }

        return ret;
    },

    isElement = it => {
        return it && it.isSurfaceElement;
    },

    baseMount = (content, targetNode)  => {
        const vueComponent = new Vue({
            el: targetNode,

            render(vueCreateElement) {
                return renderContent(vueCreateElement, content, this);
            },

            methods: {
                create() {
                },

                destroy() {
                    this.$destroy();
                }
            }
        });

        return () => vueComponent.destroy();
    },

    baseUnmount = node => {
        let ret = false;

        if (node && node.__mountedVueComponent) {
            const component = node.__mountedVueComponent;
            delete node.__mountedVueComponent;
            component.destroy();
            ret = true;
        }

        return ret;
    },

    mount = adaptMountFunction({
        mountFunction: baseMount,
        unmountFunction: baseUnmount
    }),

    inspectElement = obj => {
        let ret = null;

        if (obj.isSurfaceElement === true) {
            ret = { type: obj.type, props: obj.props };
        }

        return ret;
    },

    Surface = {
        createElement,
        defineComponent,
        inspectElement,
        isElement,
        mount
    },

    Adapter = Object.freeze({
        name: 'vue',
        api: Object.freeze({ Vue, Surface })
    });
    
Surface.Adapter = Adapter;

Object.freeze(Surface);


export {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
};

export default Surface;


// ------------------------------------------------------------------

let nextRefID = 1;


function getNextRefName() {
    const ret = 'ref-' + nextRefID.toString(16);

    if (nextRefID === Number.MAX_SAFE_INTEGER) {
        nextRefID = 0;
    } else {
        ++nextRefID;
    }

    return ret;
}

function decorateComponentFunction(componentFunction, meta) {
    const ret = function Component (props, context) {
        const newProps =
            context
                ? mergePropsWithContext(props, context, meta)
                : props;

        return componentFunction(newProps);
    };

    const config = normalizeComponentConfig(meta);

    ret.type = ret;
    ret.factory = createFactory(ret, config, Adapter); 

    return ret;
}

function decorateComponentClass(componentClass, meta) {
    const convertedConfig = convertConfig(meta);

    let ret = class Component extends componentClass {};

    if (convertedConfig.contextTypes) {
        const innerComponent = ret;

        innerComponent.displayName = meta.displayName + '-inner';

        ret = class Component extends componentClass {
            render() {
                const props = mergePropsWithContext(
                    this.props, this.context, meta);

                return createElement(innerComponent, props);
            }
        };
    }

    Object.assign(ret, convertedConfig);
    ret.type = ret;
    ret.factory = createFactory(ret, null, Adapter);

    return ret;
}

function renderContent(vueCreateElement, content, component) {
    if (!content || !content.isSurfaceElement) {
        throw new Error('no surface element');
    }

    let props = content.props;

    const
        type = content.type,
        children = convertChildren(content.children, vueCreateElement, component);

    let ret, refCallback = null, refName = null;

    if (props && props.ref) {
        refCallback = props.ref,
        refName = getNextRefName(),
        props = Object.assign({}, props, { ref: refName });
        component.__refCallbacks[refName] = refCallback;

        /*
        if (!component.__refCallbacks) {
            component.__refCallbacks = {};
        }
        component.__refCallbacks[refName] = {
            callback: ref,
            element: null
        };
        */
    }

    if (props && type === 'label' && props.htmlFor) {
        props = Object.assign({}, props);
        props.for = props.htmlFor;
        delete(props.htmlFor);
    }


    if (typeof type === 'string') {
        const attrs = Object.assign({}, props);
        const options = { attrs };

        if (attrs.style) {
            options.style = attrs.style;
            delete(attrs.style);          
        }

        for (let key of Object.keys(attrs)) {
            if (key.substr(0, 2) === 'on' && key[2] >= 'A' && key[2] <= 'Z') {
                const handler = attrs[key];
                delete(attrs[key]);

                const newKey = (key[2].toLowerCase() + key.substr(3)).toLowerCase();

                if (!options.on) {
                    options.on = {};
                }

                options.on[newKey] = handler;
            }
        }

        if (refName) {
            options.ref = refName;
            delete(options.attrs.ref);
        }

        if (attrs.dangerouslySetInnerHTML) {
            const innerHTML =
                String(attrs.dangerouslySetInnerHTML.__html || '');

            options.domProps = { innerHTML };
        }

        if (props && props.className && !props.class) {
            options.attrs.class = props.className;
            delete options.attrs.className;
        }

        ret = vueCreateElement(type, options, children);
    } else {
        const options = { props };

        if (refName) {
            options.ref = refName;
            delete(options.props.ref);
        }

        if (type && type.meta) {
            ret = type(options, ...children);
        } else {
            ret = vueCreateElement(type, options, children);
        }
    }

    return ret;
}

function convertChildren(children, vueCreateElement, component) {
    const ret = [];

    if (children && !Array.isArray(children) && typeof children[Symbol.iterator] !== 'function') {
        children = [children];
    }

    for (let item of children) {
        if (Array.isArray(item)) {
            ret.push(...convertChildren(item, vueCreateElement, component));
        } else if (typeof item === 'string') {
            ret.push(item);
        } else if (item && typeof item[Symbol.iterator] === 'function') {
            ret.push(...convertChildren(item, vueCreateElement, component));
        } else if (item && item.isSurfaceElement) {
            ret.push(renderContent(vueCreateElement, item, component));
        } else if (item !== undefined && item !== null) {
            ret.push(item);
        }
    }

    return ret;
}

function determineDefaultValues(config) {
    const ret = {};

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            if (config.properties[key].defaultValue) {
                ret[key] = config.properties[key].defaultValue;
            } else if (config.properties[key].getDefaultValue) {
                const getter = () => config.properties[key].getDefaultValue();
                
                Object.defineProperty(ret, key, { get: getter });
            }
        }
    }

    return ret;
}

function mixProps(props, events, injections, defaultValues, config) {
    let ret = Object.assign({}, props);

    // TODO
    const hasInjections = config.properties
        && Object.keys(config.properties).some(key => config.properties[key].inject);

    if (hasInjections) {
        for (let key of Object.keys(config.properties)) {
            if (config.properties[key].inject
                && injections[key] !== undefined
                && props[key] === undefined) {
                
                let injectedValue = injections[key];

                if (injectedValue instanceof Injection) {
                    injectedValue = injectedValue.value;
                }

                ret[key] = injectedValue;
            }
        }
    }

    if (defaultValues) {
        for (let key of Object.keys(defaultValues)) {
            if (ret[key] === undefined) {
                const defaultValue = defaultValues[key];

                ret[key] = defaultValue;
            }
        }
    }

    if (events) {
        for (let key of Object.keys(events)) {
            // TODO - what's with that array case
            const handler = Array.isArray(events[key])
                ? events[key][0]
                : events[key];

            ret['on' + key[0].toUpperCase() + key.substr(1)] = handler;
        }
    }

    return ret;
}


function determineInjectionKeys(config) {
    const ret = [];

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            if (config.properties[key].inject) {
                ret.push(key);
            }
        }
    }

    return ret;
}


function determineMethods(config) {
    let ret = null;

    if (config.methods) {
        ret = {};

        for (let key of config.methods) {
            ret[key] = function (...args) {
                return this.__applyMethod(key, args);
            };
        }
    }

    return ret;
}

function handleRefCallbacks(comp) {
    for (let key of Object.keys(comp.__refCallbacks)) {
        const
            callback = comp.__refCallbacks[key],
            ref = comp.$refs[key];
        
        delete(comp.__refCallbacks[key]);

        comp.__refCleanupCallbacks[key] = () => callback(null, ref);

        if (callback) {
            callback(ref, null);
        }
    }
}


function handleRefCleanupCallbacks(comp) {
    for (let key of Object.keys(comp.__refCleanupCallbacks)) {
        //if (!comp.$refs[key]) {
            const callback = comp.__refCleanupCallbacks[key];
            
            delete(comp.__refCleanupCallbacks[key]);

            if (callback) {
                callback();
            }
//        }
    }
}

class Injection {
    constructor(getValue) {
        Object.defineProperty(this, 'value', { get: getValue });
    }
}
