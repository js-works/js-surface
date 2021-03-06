import printError from './printError';
import validateProperty from '../validation/validateProperty';

export default function createPropsAdjuster(config) {
    let ret;

    const
        propertiesConfig = config.properties || {},
        componentName = config.displayName,
        validations = [],
        defaults = {};

    let hasDefaults = false;
    
    for (let key of  Object.keys(propertiesConfig)) {
        const
            type = propertiesConfig[key].type,
            
            nullable =
                typeof propertiesConfig[key].nullable === 'boolean' 
                ? propertiesConfig[key].nullable
                : null,

            constraint = propertiesConfig[key].constraint || null,
            defaultValue = propertiesConfig[key].defaultValue,
            getDefaultValue = propertiesConfig[key].getDefaultValue,

            hasDefaultValue = 
                propertiesConfig[key].hasOwnProperty('defaultValue')
                    || !!getDefaultValue,

            defaultValueProvider =
                getDefaultValue
                    ? getDefaultValue
                    : (hasDefaultValue ? () => defaultValue : null);
            
        hasDefaults = hasDefaults || hasDefaultValue;

        validations.push([
            key,
            type,
            nullable,
            constraint,
            defaultValueProvider
        ]);

        if (getDefaultValue) {
            Object.defineProperty(defaults, key, {
                get: getDefaultValue
            });
        } else if (hasDefaultValue) {
            defaults[key] = defaultValue;
        }
    }

    ret = (props, validating) => {
        let adjustedProps = props;

        if (hasDefaults) {
            adjustedProps = Object.assign({}, props); // TODO: really necessary?

            for (const key of Object.keys(defaults)) {
                if (adjustedProps[key] === undefined) {
                    adjustedProps[key] = defaults[key];
                }
            }
        }

        if (validating) {
            const err = validateProps(adjustedProps, validations);

            if (err) {
                const errMsg = 'Error while validating props for ' 
                    +  `'${componentName}': ${err.message}`;

                printError(errMsg);

                printError(`Negatively validated props for '${componentName}':`,
                    props);

                throw new Error(errMsg);
            }
        }

        return adjustedProps;
    };

    return ret;
}

function validateProps(props, validations) {
    let errMsg = null;

    const keysToBeChecked = props
        ? new Set(Object.getOwnPropertyNames(props))
        : new Set();

    // Depending on the platform they may be still available
    keysToBeChecked.delete('ref');
    keysToBeChecked.delete('key');

    // TODO: That's not really nice - make it better!
    // Ignore children
    keysToBeChecked.delete('children');

    for (let [propertyName, type, nullable, constraint, defaultValueProvider] of validations) {
        let prop = props[propertyName];

        keysToBeChecked.delete(propertyName);

        // TODO!!!
        /*
        if (defaultValueProvider && prop === defaultValue) {
            // TODO - shall the default value always be fine???
            // everything fine
        } else */if (nullable === true && prop === null) {
            // everything fine
        } else if (!defaultValueProvider && props[propertyName] === undefined) {
            errMsg = `Missing mandatory property '${propertyName}'`;
        } else {
            const err = validateProperty(prop, propertyName, type, nullable, constraint);

            if (err) {
                errMsg = err.message;
            }
        }
        
        if (errMsg) {
            break;
        }
    }

    if (!errMsg && keysToBeChecked.size > 0) {
        const joined = Array.from(keysToBeChecked.values()).join(', ');

        errMsg = `Illegal property key(s): ${joined}`;
    }

    return errMsg ? new Error(errMsg) : null;
}
