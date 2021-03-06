import { defineComponent, mount, Html } from 'js-surface';
import { Component } from 'js-surface/common';
import { Spec } from 'js-spec';

const { b, button, div, label, span } = Html;

const CounterInfo = defineComponent({
    displayName:  'CounterInfo',

    properties: {
        value: {
            type: Number
        }
    },

    render(props) {
        return (
            label(null,
               b(null,
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

    operations: ['resetCounter'],

    main: class extends Component {
        constructor(props) {
            super(props);

            this.state = { counterValue: props.initialValue };
        }

        increaseCounter(delta) {
            this.setState({ counterValue: this.state.counterValue + delta });
        }

        shouldUpdate() {
            console.log('[shouldUpdate]', arguments);
            return true;
        }

        componentWillReceiveProps(nextProps) {
            console.log('[componentWillReceiveProps]', arguments);
        }

        componentWillChangeState(nextState) {
            console.log('[componentWillChangeState]', arguments);
        }

        componentDidChangeState(prevState) {
            console.log('[componentDidChangeState]', arguments);

            if (this.props.onChange) {
                this.props.onChange({
                    type: 'change',
                    value: this.state.counterValue
                });
            }
        }

        componentWillMount() {
            console.log('[componentWillMount]', arguments);
        }

        componentDidMount() {
            console.log('[componentDidMount]', arguments);
        }

        componentWillUpdate() {
            console.log('[componentWillUpdate]', arguments);
        }

        componentDidUpdate() {
            console.log('[componentDidUpdate]', arguments);
        }

        componentWillUnmount() {
            console.log('[componentWillUnmount]:', arguments);
        }

        resetCounter(value = 0) {
            this.setState({ counterValue: value });
        }

        render() {
            return (
                span({ className: 'counter' },
                    button({
                        className: 'btn btn-default',
                        onClick: () => this.increaseCounter(-1)
                    },
                        '-'),
                    div({
                        style: {
                            width: '30px',
                            display: 'inline-block',
                            textAlign: 'center'
                        }
                    },
                        CounterInfo({ value: this.state.counterValue })),
                    button({
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
            div({ className: 'counter-ctrl' },
                button({
                    className: 'btn btn-info',
                    onClick: () => counterInstance.resetCounter(0)
                },
                    'Set to 0'),
                ' ',
                Counter({ ref: it => { counterInstance = it; } }),
                ' ',
                button({
                    className: 'btn btn-info',
                    onClick: () => counterInstance.resetCounter(100)
                },
                    'Set to 100')));
    }
});

mount(CounterCtrl(), 'main-content');

