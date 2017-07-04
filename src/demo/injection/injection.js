import {
    createElement as h,
    defineComponent,
    render,
    Component
} from 'js-surface';

const Parent = defineComponent(class extends Component {
    static get displayName() {
        return 'Parent';
    }

    static get properties() {
        return {
            masterValue: {
                type: String,
                defaultValue: 'default-value'
            }
        };
    }

    static get childInjections() {
        return ['value'];
    }

    provideChildInjections() {
        return {
            value: this.props.masterValue
        };
    }

    render() {
        return h('div',
            h('div', 'Provided value: ', this.props.masterValue),
            h('br'),
            h('div',
                ChildFunctionBased(),
                ChildClassBased(),
                ChildFunctionBased({ value: 'with explicit value' }),
                ChildClassBased({ value: 'with another explicit value' })));
    }
});

const ChildFunctionBased = defineComponent({
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

const ChildClassBased = defineComponent(class extends Component {
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

render(Parent({ masterValue: 'the injected value' }), 'main-content');