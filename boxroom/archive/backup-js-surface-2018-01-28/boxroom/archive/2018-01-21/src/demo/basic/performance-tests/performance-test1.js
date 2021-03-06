import {
    createElement as h,
    hyperscript,
    Adapter,
    Config
} from 'js-surface';

const
    iterationCount = 200000,
    contentContainer = document.getElementById('main-content'),
    adapterName = Adapter.name,
    tests = [];

let createElement = null;

switch (adapterName) {
case 'react':
    createElement = Adapter.api.React.createElement;
    break;

case 'react-lite':
    createElement = Adapter.api.createElement;
    break;

case 'preact':
    createElement = Adapter.api.Preact.createElement;
    break;

case 'inferno':
    createElement = Adapter.api.Inferno.createElement;
    break;
}

contentContainer.innerHTML = 'Please wait - performance stests are running ...';
let report = '';

Config.validateProps = false;
Config.validateDefs = false;


if (adapterName !== 'vue') {
    tests.push({
        displayName: `Using '${Adapter.name}'`,

        run() {
            for (let i = 0; i < iterationCount; ++i) {
                createElement('div',
                    { className: 'my-class', id: 'my-id' },
                    createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
            }
        }
    });
}

tests.push({
    displayName: 'Using js-surface with createElement without hyperscript',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
        //    let x = h('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
            h('div',
                { className: 'my-class', id: 'my-id' },
                h('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
        }
    }
});

tests.push({
    displayName: 'Using surface with createElement with hyperscript',

    run() {
        
        for (let i = 0; i < iterationCount; ++i) {
 //           hyperscript('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
            h('div#my-id.my-class', { className: 'x' },
                h('div#my-id2.my-class2', 'my-div'));    
        }
    }
});

tests.push({
    displayName: 'Using js-surface with hyperscript without hyperscript',

    run() {
        for (let i = 0; i < iterationCount; ++i) {
        //    let x = h('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
            hyperscript('div',
                { className: 'my-class', id: 'my-id' },
                hyperscript('div', { className: 'my-class2', id: 'my-id2'}, 'my-div'));    
        }
    }
});

tests.push({
    displayName: 'Using surface with hyperscript with hyperscript',

    run() {
        
        for (let i = 0; i < iterationCount; ++i) {
 //           hyperscript('div.my-class#my-id > div.my-class2#my-id2', 'my-div');
            hyperscript('div#my-id.my-class', { className: 'x' },
                hyperscript('div#my-id2.my-class2', 'my-div'));    
        }
    }
});

let baseDuration = null;

for (let i = 0; i < tests.length; ++i) {
    const
        test = tests[i],
        startTime = Date.now();
    
    test.run();

    const
        stopTime = Date.now(),
        duration = (stopTime - startTime),
        factor = baseDuration ? Math.round(duration / baseDuration * 100) / 100 : null;

    if (i === 0) {
        baseDuration = duration;
    }

    let message = `Run time for test '${test.displayName}': ${duration} ms`;

    if (factor) {
        message += ` => ${factor}x`;
    }

    if (i == 0) {
        report = message;
    } else {
        report += '<br/>' + message;
    }
}

report += '<br/><br/>All tests finished.';
contentContainer.innerHTML = report;
