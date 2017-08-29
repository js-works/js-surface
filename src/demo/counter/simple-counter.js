import {
    createElement as h,
    defineClassComponent,
    render
} from 'js-surface';


const SimpleCounter = defineClassComponent({
    displayName: 'SimpleCounter',

    properties: {
        label: {
            type: String,
            defaultValue: 'Counter:'
        },
        initialValue: {
            type: Number,
            defaultValue: 0
        }
    },

    constructor(props) {
        this.state = { counterValue: props.initialValue };
    },

    incrementCounter(delta) {
        this.state = {
            counterValue: this.state.counterValue + delta
        };
    },

    onWillMount() {
        console.log('onWillMount');
        //alert('onWillMount');
    },

    onDidMount() {
        console.log('onDidMount');
        //alert('onDidMount');
    },

    onWillUpdate() {
        console.log('onWillUpdate');
        //alert('onWillUpdate');
    },

    onDidUpdate() {
        console.log('onDidUpdate');
        //alert('onDidUpdate');
    },

    onWillChangeState(nextState) {
        console.log('onWillChangeState', nextState);
    },

    onDidChangeState(prevState) {
        console.log('onDidChangeState', prevState);
    },

    render() {
        return (
            h('div.simple-counter',
                h('label.simple-counter-label.btn',
                    this.props.label),
                h('button.simple-counter-decrease-button.btn.btn-default',
                    { onClick: () => this.incrementCounter(-1) },
                    '-'),
                h('div.simple-counter-value.btn',
                    this.state.counterValue),
                h('button.simple-counter-increase-button.btn.btn-default',
                    { onClick: () => this.incrementCounter(1) },
                    '+'))
        );
    }
});

render(SimpleCounter({ initialValue: 100 }), 'main-content');
