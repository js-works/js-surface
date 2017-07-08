import {
    createElement as h,
    defineClassComponent,
    render,
    Component
} from 'js-surface';


const MountUnmount = defineClassComponent(class extends Component {
    static get displayName() {
        return 'MountUnmount';
    }

    constructor() {
        super();
        this.__interval = null;
        this.__showFoo = true;
    }


    onDidMount() {
        this.__interval = setInterval(() => {
            this.__showFoo = !this.__showFoo;
            this.refresh();
        }, 3000);
    }

    onWillUnmount() {
        clearInterval(this.__interval);
        this.__interval = null;
    }

    render() {
        return this.__showFoo
            ? ComponentA({ ref: this.refCallback.bind(this, 'ComponentA') })
            : ComponentB({ ref: this.refCallback.bind(this, 'ComponentB')});
    }

    refCallback(type, ref, prevRef) {
        console.log(`Invoked ref callback - ${type}: `, String(ref), String(prevRef));
    }
});

const ComponentA = defineClassComponent(class extends Component {
    static get displayName() {
        return 'ComponentA';
    }

    onDidMount() {
        console.log('Did mount ComponentA...');
    }

    onWillUnmount() {
        console.log('Will unmount ComponentA...');
    }

    render() {
        return h('div', ' - - - ComponentA - - - ');
    }
});

const ComponentB = defineClassComponent(class extends Component {
    static get displayName() {
        return 'ComponentB';
    }

    onDidMount() {
        console.log('Did mount ComponentB..');
    }

    onWillUnmount() {
        console.log('Will unmount ComponentB...');
    }

    render() {
        return h('div', ' - - - ComponentB - - - ');
    }
});

render(MountUnmount(), 'main-content');