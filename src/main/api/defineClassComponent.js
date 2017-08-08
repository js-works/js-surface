import validateComponentClass
    from '../internal/validation/validateComponentClass.js';

import validateComponentClassConfig
    from '../internal/validation/validateComponentClassConfig.js';

import { defineStandardComponent, Component }  from 'js-surface';

export default function defineClassComponent(config) {
    let ret;

    if (typeof config === 'function') {
        ret = defineClassComponentByClass(config);
    } else {
        ret = defineClassComponentByConfig(config);
    }

    return ret;
}

function defineClassComponentByConfig(config) {
    const err = validateComponentClassConfig(config);
    
    if (err) {
        throw err;
    }

    const componentClass = class extends Component {
        constructor(props, platformComponent) {
            super(props, platformComponent);

            for (let key of Object.keys(this.constructor.prototype)) {
                if (typeof this[key] === 'function') {
                    this[key] = this[key].bind(this);
                }
            }

            if (config.constructor) {
                config.constructor.call(this, props);
            }
        }
    };

    for (let key of Object.keys(config)) {
        const value = config[key];

        if (typeof value !== 'function') {
            componentClass[key] = value;
        } else if (key !== 'constructor') {
            componentClass.prototype[key] = value;
        }
    }

    return defineClassComponentByClass(componentClass);
}

function defineClassComponentByClass(componentClass) {
    const err = validateComponentClass(componentClass);
    
    if (err) {
        throw err;
    }

    const
        publicMethods = componentClass.publicMethods || null,
        instanceClass = function () {
            this.__component = null;
        };

    if (publicMethods) {
        for (let key of Object.keys(publicMethods)) {
            instanceClass.prototype[key] = function () {
                let ret = undefined;
                
                if (this.__component) {
                    ret = publicMethods[key].apply(this.__component, arguments);
                }

                return ret;
            };       
        }
    }

    const
        init = (viewConsumer, stateConsumer, platformComponent) => {
            let
                instance = new instanceClass(),
                component = null,
                content = null,
                done = false;

            const propsConsumer = props => {
                if (done) {
                    return;
                } else if (props === undefined) {
                    if (component) {
                        component.onWillUnmount();
                    }

                    done = true;
                    return;
                }

                if (!component) {
                    component = new componentClass(props, platformComponent);
                    instance.__component = component;

                    if (stateConsumer) {
                        stateConsumer(component.state);
                    }
                        
                    component.__stateConsumer = state => {
                        if (stateConsumer) {
                            stateConsumer(state);
                        }    
                    };
                    
                    let initialized = false;

                    component.__refresh = function (prevProps, prevState) {
                        content = component.render();
                        const renderingDonePromise = viewConsumer(content);

                        if (renderingDonePromise) {
                            renderingDonePromise.then(
                                successful => {
                                    if (successful) {
                                        if (!initialized) {
                                            initialized = true;
                                            component.onDidMount();
                                        } else {
                                            component.onDidUpdate(prevProps, prevState);
                                        }
                                    }
                                }
                            );
                        }
                    };

                    component.onWillMount();
                    component.refresh(null, null);
                } else {
                    component.onWillReceiveProps(props);

                    const shouldUpdate = component.shouldUpdate(props, component.state);

                    if (shouldUpdate) {
                        component.onWillUpdate(props, component.state);
                    }

                    const prevProps = component.props;

                    // Sorry for that :-(
                    component.__props = props;

                    if (shouldUpdate) {
                        component.refresh(prevProps, component.state);
                    }
                }
            };

            const initResult = {
                propsConsumer,
                instance 
            };

            if (config.childInjections) {
                initResult.provideChildInjections = () => component
                        ? component.provideChildInjections()
                        : null;
            }

            return initResult;
        };


    const config = {
        displayName:  componentClass.displayName,
        properties: componentClass.properties,
        init
    };

    if (componentClass.childInjections) {
        config.childInjections = componentClass.childInjections; 
    }

    if (publicMethods) {
        config.publicMethods = {};

        for (let key of Object.keys(publicMethods)) {
            config.publicMethods[key] = function (...args) {
                return publicMethods[key].apply(this.__component, args);
            };
        }
    }

    const factory = defineStandardComponent(config);
    factory.meta.componentClass = componentClass;
    return factory;
}
