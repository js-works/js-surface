import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

const Clock = defineComponent({
    displayName: 'Clock',

    main(updateView) {
        let
            time = null,
            intervalId = null;

        const
            updateTime = () => {
                time = new Date().toLocaleTimeString();
            },

            render = () => {
                return (
                    h('div', null,
                        h('h3', null,
                            'Current time'),
                        TimeInfo({ time }))
                );
            };
    
        updateTime();
        
        intervalId = setInterval(() => {
            updateTime();
            updateView(render());
        }, 1000);

        return {
            setProps() {
                updateView(render());
            },

            close() {
                clearInterval(intervalId);
                intervalId = null;
            }
        };
    }
});

const TimeInfo = defineComponent({
    displayName: 'TimeInfo',
    
    properties: {
        time: {
            type: String
        }
    },

    render(props) {
        return h('div', null, props.time);
    }
});

mount(Clock(), 'main-content');
