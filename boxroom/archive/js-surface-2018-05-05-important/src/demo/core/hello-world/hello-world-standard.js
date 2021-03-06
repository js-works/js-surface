import { createElement as h, defineComponent, mount } from 'js-surface';

const HelloWorld = defineComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },

    init: props => {
        return {
            render() {
                return h('div', null, 'Hello ' + props.name + '!');
            }
        };
    }
});

mount(HelloWorld({ name: 'Jane Doe' }), 'main-content');
