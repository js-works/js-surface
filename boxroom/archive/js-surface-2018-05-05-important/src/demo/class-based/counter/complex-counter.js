import { createElement as h, defineComponent, mount } from 'js-surface';
import { Component } from 'js-surface/common/classes';
import { Spec } from 'js-spec';

const CounterInfo = defineComponent({
    displayName:  'CounterInfo',

    properties: {
        value: {
            type: Number
        }
    },

    render(props) {
        return (
            h('label', null,
               h('b', null,
                    props.value)));
    }
});

// --------------------------------------------------------------------

const Counter = defineComponent({
    displayName: 'Counter',

    properties: {
        initialValue: {
            type: Number,
            constraint: Spec.integer,
            defaultValue: 0
        },

        onChange: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    methods: ['resetCounter'],

    main: class extends Component {
        constructor(props) {
            super(props);

            this.state = { counterValue: props.initialValue };
        }

        increaseCounter(delta) {
            this.setState({ counterValue: this.state.counterValue + delta });
        }

        resetCounter(value = 0) {
            this.setState({ counterValue: value });
        }

        render() {
            return (
                h('span', { className: 'counter' },
                    h('button', {
                        className: 'btn btn-default',
                        onClick: () => this.increaseCounter(-1)
                    },
                        '-'),
                    h('div', {
                        style: {
                            width: '30px',
                            display: 'inline-block',
                            textAlign: 'center'
                        }
                    },
                        CounterInfo({ value: this.state.counterValue })),
                    h('button', {
                        className: 'btn btn-default',
                        onClick: () => this.increaseCounter(1)
                    },
                        '+'))
            );
        }
    }
});

// --------------------------------------------------------------------

const CounterCtrl = defineComponent({
    displayName: 'CounterCtrl',

    render () {
        let counterInstance = null;

        return (
            h('div', { className: 'counter-ctrl' },
                h('button', {
                    className: 'btn btn-info',
                    onClick: () => counterInstance.resetCounter(0)
                },
                    'Set to 0'),
                ' ',
                Counter({ ref: it => { counterInstance = it; } }),
                ' ',
                h('button', {
                    className: 'btn btn-info',
                    onClick: () => counterInstance.resetCounter(100)
                },
                    'Set to 100')));
    }
});

mount(CounterCtrl(), 'main-content');

