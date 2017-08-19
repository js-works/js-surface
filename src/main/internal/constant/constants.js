const
    FORBIDDEN_METHOD_NAMES = new Set([
        'props', 'state', 'shouldComponentUpdate',
        'setState', 'updateState',
        'componentWillReceiveProps', 'forceUpdate',
        'componentWillMount', 'componentDidMount',
        'componentWillUpdate', 'componentDidUpdate',
        'constructor', 'forceUpdate']),

    REGEX_COMPONENT_SYSTEM_NAME = /^[a-z][a-z]*(-[a-z][a-z]*)*$/,
    REGEX_COMPONENT_NAME = /^[A-Z][a-zA-Z0-9_-]*$/,
    REGEX_PROPERTY_NAME = /^[a-z][a-zA-Z0-9_-]*$/,
    REGEX_INJECTION_NAME = /^[a-zA-Z][a-zA-Z0-9_-]*$/,
    REGEX_METHOD_NAME = /^[a-z][a-zA-Z0-9_-]*$/,
    REGEX_CALLBACK_PROPERTY_NAME = /^on(-|[A-Z])[a-zA-Z0-9_-]+$/;

export {
    FORBIDDEN_METHOD_NAMES,
    REGEX_COMPONENT_SYSTEM_NAME,
    REGEX_COMPONENT_NAME,
    REGEX_PROPERTY_NAME,
    REGEX_INJECTION_NAME,
    REGEX_METHOD_NAME,
    REGEX_CALLBACK_PROPERTY_NAME
};
