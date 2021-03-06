import { ComponentSystem } from 'js-surface';

if (ComponentSystem.adapter.name !== 'vue') {
    document.getElementById('main-content').innerHTML =
        'This demo only works with Vue.<br/>'
        + 'To start the demo, please switch the adapter to "vue".';
} else {
    System.import('./vue/vue-demo-include.js');
}
