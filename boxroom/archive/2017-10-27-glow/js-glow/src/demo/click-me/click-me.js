import {
    createElement as h,
    defineClassComponent,
    mount,
    Component
} from 'js-glow';

const meta = {
    displayName: 'ClickMe',

    properties: {
        text: {
            type: String
        },
        onClick: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    }
};

class CustomComponent extends Component {
    onClick() {
        alert(`You've clicked on "${this.props.text}"`);
    }

    render() {
        return (
            h('button',
                { onClick: () => this.onClick() },
                this.props.text)
        );
    }
}

const ClickMe = defineClassComponent(CustomComponent, meta);

mount(ClickMe({ text: 'Click me!' }), 'main-content');
