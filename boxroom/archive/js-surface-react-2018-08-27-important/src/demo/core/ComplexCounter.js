import { createElement as h, defineComponent } from 'js-surface';
import { Spec } from 'js-spec';

const CounterInfo = defineComponent({
  displayName:  'CounterInfo',

  properties: {
    value: {
      type: Number
    }
  },

  main: {
    functional: true,

    render(props) {
      return (
        h('label',
          null,
          h('b',
            null,
            props.value)));
    }
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

  main: {
    functional: false,

    init(getProps, getState, updateState) {
      let counterValue;

      const
        setCounterValue = n => {
          counterValue = n;
    
          updateState(() => ({ counterValue }));
        },

        increaseCounter = n => {
          setCounterValue(counterValue + n);
        },

        render = () => {
          return (
            h('span',
              { className: 'counter' },
              h('button',
                {
                  className: 'btn btn-default',
                  onClick: () => increaseCounter(-1)
                },
                '-'),
              h('div',
                { style: { width: '30px', display: 'inline-block', textAlign: 'center' }},
                CounterInfo({ value: counterValue })),
              h('button',
                {
                  className: 'btn btn-default',
                  onClick: () => increaseCounter(1)
                }, 
                '+'))
          );
        },

        proxy = {
          resetCounter(n = 0) {
            setCounterValue(n);
          }
        };
      
      setCounterValue(0);

      return { render, proxy };
    }
  }
});

// --------------------------------------------------------------------

const CounterCtrl = defineComponent({
  displayName: 'CounterCtrl',

  main: {
    functional: false,

    init() {
      let counterInstance = null;

      return {
        render() {
          return (
            h('div',
              { className: 'counter-ctrl' },
              h('button',
                {
                  className: 'btn btn-info',
                  onClick: () => counterInstance.resetCounter(0)
                },
                'Set to 0'),
              ' ',
              Counter({
                ref: it => {
                  counterInstance = it;
                }
              }),
              ' ',
              h('button',
                {
                  className: 'btn btn-info',
                  onClick: () => counterInstance.resetCounter(100)
                },
                'Set to 100'))
          );
        }
      };
    }
  }
});

export default CounterCtrl();
