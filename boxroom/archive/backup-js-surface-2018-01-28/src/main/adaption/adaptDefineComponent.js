import validateComponentConfig from '../validation/validateComponentConfig';
import ConfigValues from '../config/ConfigValues';
import warn from '../helper/warn';
import buildComponentFactoryAttributes from '../helper/buildComponentFactoryAttributes';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import createPropsAdjuster from '../helper/createPropsAdjuster';
import validateInitResult from '../validation/validateInitResult';

export default function adaptDefineComponent({
    defineFunctionalComponent,
    defineStandardComponent
}) {
    const
        defineFunctionalComponentAdapted =
            adaptDefineFunctionalComponent(defineFunctionalComponent),

        defineStandardComponentAdapted =
            adaptDefineStandardComponent(defineStandardComponent);

    return function (config) {
        const
            isObject = config && typeof config === 'object',
            isFunctional = isObject && typeof config.render === 'function';

        if (ConfigValues.validateDefs === true) {
            const error = validateComponentConfig(config);

            if (error) {
                warn('[defineComponent] ' + error.message);

                warn('[defineComponent] Negatively validated '
                    + 'component configuration:',
                        config);

                throw new Error(`[defineComponent] ${error.message}`);
            }
        }

        return isFunctional
            ? defineFunctionalComponentAdapted(config)
            : defineStandardComponentAdapted(config);
    };
}

function adaptDefineFunctionalComponent(defineComponent) {
    const ret = cfg => {
        // cfg has already been validated

        const
            config = normalizeComponentConfig(cfg),
            propsAdjuster = createPropsAdjuster(config),

            adjustedConfig = {
                displayName:  config.displayName,
                properties: config.properties,
                render: props => config.render(propsAdjuster(props, ConfigValues.validateProps))
            };

        const factory = defineComponent(adjustedConfig);

        const factoryAttributes =
            buildComponentFactoryAttributes(factory, config, ret);

        Object.assign(factory, factoryAttributes);

        return factory;
    };

    return ret;
}

function adaptDefineStandardComponent(defineComponent) {
    const ret = cfg => {
        // cfg has already been validated

        const
            config = normalizeComponentConfig(cfg),
            propsAdjuster = createPropsAdjuster(config),
    
            adjustedConfig = Object.assign({}, config, {
                init: (updateView, forwardState) => {
                    const
                        result = config.init(updateView, forwardState),
                        err = validateInitResult(result, config);

                    if (err) {
                        throw err;
                    }

                    return Object.assign({}, result, {
                        setProps(props) {
                            const props2 = props === undefined
                                ? undefined
                                : propsAdjuster(props, ConfigValues.validateProps);


                            result.setProps(props2);
                        }
                    });
                }
            });

        const factory = defineComponent(adjustedConfig);
        
        const factoryAttributes =
            buildComponentFactoryAttributes(factory, config, ret);
        
        Object.assign(factory, factoryAttributes);

        return factory;
    };
    
    return ret;
}
