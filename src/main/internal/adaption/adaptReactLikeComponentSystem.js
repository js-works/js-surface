import shapeOfAdaptReactLikeComponentSystemConfig from '../shape/shapeOfAdaptReactLikeComponentSystemConfig.js';

import { Spec } from 'js-spec';

import adaptComponentSystem from '../../api/adaptComponentSystem.js';

const
    returnNull = () => null,
    fakeState = Object.freeze({});

export default function adaptReactLikeComponentSystem(reactLikeConfig) {
    const err = Spec.shape(shapeOfAdaptReactLikeComponentSystemConfig)(reactLikeConfig);

    if (err) {
        throw new Error(
            "Illegal first argument 'reactLikeConfig' for "
            + "function 'adaptReactLikeComponentSystem':"
            + err);
    }

    const CustomComponent = defineCustomComponent(reactLikeConfig.Component);

    const newConfig = {
        isBrowserBased: reactLikeConfig.isBrowserBased !== false,

        defineFunctionalComponent: config => {
            let ret;
            const injectPropsNames = [];

            if (config.properties) {
                for (let property of Object.keys(config.properties)) {
                    if (config.properties[property].inject) {
                        injectPropsNames.push(property);
                    }
                }
            }

            if (injectPropsNames.length === 0) {
                ret = props => config.render(props);
            } else {
                ret = (props, context) => {
                    return config.render(mixPropsWithContext(props, context));
                };

                ret.contextTypes = {};

                for (let propName of injectPropsNames) {
                    ret.contextTypes[propName] = returnNull;
                }
            }

            ret.displayName = config.displayName;

            return reactLikeConfig.createFactory(ret);
        },

        defineStandardComponent: config => {
            class ExtCustomComponent extends CustomComponent {
                constructor(...args) {
                    super(args, config);
                    this.__childContextTypes = undefined;
                }
            }

            ExtCustomComponent.displayName = config.displayName;

            if (config.api) {
                for (let key of Object.keys(config.api)) {
                    ExtCustomComponent.prototype[key] = function () {
                        return config.api[key](this.__instance, arguments);
                    };
                }
            }

            if (config.childInjection) {
                ExtCustomComponent.childContextTypes = {};

                for (let key of config.childInjection.keys) {
                    ExtCustomComponent.childContextTypes[key] = returnNull;
                }

                ExtCustomComponent.prototype.getChildContext = function() {
                    const state = this.__state === fakeState ? null : this.__state;
                    return config.childInjection.get(this.props, state);
                };
            }

            ExtCustomComponent.displayName = config.displayName;

            const injectPropsNames = [];

            if (config.properties) {
                for (let property of Object.keys(config.properties)) {
                    if (config.properties[property].inject) {
                        injectPropsNames.push(property);
                    }
                }
            }

            if (injectPropsNames.length > 0) {
                ExtCustomComponent.contextTypes = {};

                for (let propName of injectPropsNames) {
                    ExtCustomComponent.contextTypes[propName] = returnNull;
                }
            }

            return reactLikeConfig.createFactory(ExtCustomComponent);
        },

        createElement: reactLikeConfig.createElement,

        isElement(it)  {
            return it !== undefined
                && it !== null
                && reactLikeConfig.isValidElement(it);
        },

        render: reactLikeConfig.render
    };

    return adaptComponentSystem(newConfig);
}

function defineCustomComponent(ReactLikeComponent) {
    const customClass = class CustomComponent extends ReactLikeComponent {
        constructor(superArgs, config) {
            super(...superArgs);

            this.__viewToRender = null;
            this.__resolveRenderingDone = null;
            this.__shouldUpdate = false;
            this.state = fakeState;

            let initialized = false;

            const
                { propsCallback, instance } = config.init(
                    view => {
                        this.__viewToRender = view;

                        if (initialized) {
                            this.__shouldUpdate = true;
                            this.setState(fakeState);
                        } else {
                            initialized  = true;
                        }

                        return new Promise(resolve => {
                            this.__resolveRenderingDone = () => {
                                this.__resolveRenderingDone = null;
                                resolve(true);
                            };
                        });

                    },
                    state => {
                        this.state = state;
                    });

            this.__propsCallback = propsCallback;
            this.__instance = instance;
        }

        componentWillMount() {
            this.props = mixPropsWithContext(this.props, this.context);
            this.__propsCallback(this.props);
        }

        componentDidMount() {
            if (this.__resolveRenderingDone) {
                this.__resolveRenderingDone();
            }
        }

        componentDidUpdate() {
            if (this.__resolveRenderingDone) {
                this.__resolveRenderingDone();
            }
        }

        componentWillUnmount() {
            this.__propsCallback(undefined);
        }

        componentWillReceiveProps(nextProps) {
            this.props = mixPropsWithContext(nextProps, this.context);
            this.__propsCallback(this.props);
        }

        shouldComponentUpdate() {
            const ret = this.__shouldUpdate;

            if (ret) {
                this.__shouldUpdate = false;
            }

            return ret;
        }

        render() {
            return this.__viewToRender;
        }
    };

    return customClass;
}

function mixPropsWithContext(props, context) {
    let ret = props;

    if (context) {
        ret = Object.assign({}, props);

        for (let key of Object.keys(context)) {
            if (context[key] !== undefined && props[key] === undefined) {
                ret[key] = context[key];
            }
        }
    }

    return ret;
}