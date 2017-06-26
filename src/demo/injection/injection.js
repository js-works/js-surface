import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent,
    render,
    Component
} from 'js-surface';

const Parent = defineClassComponent(class extends Component {
    static get displayName() {
        return 'Parent';
    }

    static get properties() {
        return {
            value: {
                type: String
            }
        };
    }

    static get childInjection() {
        return {
            keys: ['value'],

            get(props) {
                return {
                    value: props.value
                };
            }
        };
    }

    render() {
        return h('div',
            h('div', 'Provided value: ', this.props.value),
            h('br'),
            h('div',
                ChildFunctionBased(),
                ChildClassBased(),
                ChildFunctionBased({ value: 'with explicit value' }),
                ChildClassBased({ value: 'with another explicit value' })));
    }
});

const ChildFunctionBased = defineFunctionalComponent({
    displayName: 'ChildFunctionBased',

    properties: {
        value: {
            type: String,
            inject: true,
            defaultValue: 'default value'
        }
    },

    render(props) {
        return h('div', 'ChildFunctionBased(', props.value, ')');
    }
});

const ChildClassBased = defineClassComponent(class extends Component {
    static get displayName() {
        return 'ChildClassBased';
    }

    static get properties() {
        return {
            value: {
                type: String,
                inject: true,
                defaultValue: 'default value'
            }
        };
    }

    render() {
        return h('div', 'ChildClassBased(', this.props.value, ')');
    }
});

render(Parent({ value: 'the injected value' }), 'main-content');