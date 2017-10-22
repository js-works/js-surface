import { parseHyperscript } from '../helper/parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function adaptHyperscript(createElement, isElement) {
    return function (/* arguments */) {
        const tag = arguments[0];

        let ret = null;

        if (typeof tag === 'string') {
            let hyperscriptData = hyperscriptCache[tag];

            if (hyperscriptData === simpleTagMark) {
                ret = applyCreateElement.apply(null, arguments);
            } else if (hyperscriptData) {
                ret = createHyperscriptElement(arguments, hyperscriptData);
            } else {
                hyperscriptData = parseHyperscript(tag);

                if (hyperscriptData === null) {
                    throw new Error(
                        "[createElement] First argument 'tag' "
                        + `is not in valid hyperscript format ('${tag}')`);
                }
                
                if (hyperscriptData.length === 1
                    && !hyperscriptData[0].attrs) {

                    hyperscriptCache[tag] = simpleTagMark;
                    ret = applyCreateElement.apply(null, arguments);
                } else {
                    hyperscriptCache[tag] = hyperscriptData;
                    ret = createHyperscriptElement(arguments, hyperscriptData);
                }
            }
        } else {
            ret = applyCreateElement(arguments);
        }

        return ret;
    };

    function isAttrs(it) {
        return  it === undefined
            || it === null
            || typeof it === 'object'
                && !it[Symbol.iterator]
                && !isElement(it);
    }

    function applyCreateElement(/* arguments */) {
        let ret = null;

        const
            secondArg = arguments[1],
            secondArgIsAttrs = isAttrs(secondArg);
            /*
            isAttrs =
                secondArg === undefined
                    || secondArg === null
                    || typeof secondArg === 'object'
                        && !secondArg[Symbol.iterator]
                        && !isElement(secondArg);
            */
        if (secondArgIsAttrs) {
            ret = createElement.apply(null, arguments);
        } else {
            const firstArg = arguments[0];

            arguments[0] = null;
            //Array.prototype.unshift.call(arguments, firstArg);
            //ret = createElement.apply(null, arguments);

            ret = createElement.call(null, firstArg, null, arguments[1], arguments[2], arguments[3], arguments[4])
        }

        return ret;
    }

    function createHyperscriptElement(args, hyperscriptData) {
        let currElem = null;
        
        const dataLength = hyperscriptData.length;

        for (let i = dataLength - 1; i >= 0; --i) {
            const { tag, attrs, entries } = hyperscriptData[i];

            if (i < dataLength - 1) {
                currElem = createElement(tag, attrs, currElem);
            } else {
                const
                   // attrs2 = attrs ? Object.assign({}, attrs) : {},
                    attrs2 = {},
                    className = attrs && attrs.className ? attrs.className : null,
                    hasProps = isAttrs(args[1]);

                // This is faster then Object.assign
                for (let i = 0; i < entries.length; ++i) {
                    const entry = entries[i];
                    attrs2[entry[0]] = entry[1];
                }

                if (hasProps) {
                    Object.assign(attrs2, args[1]);

                    if (className !== attrs2.className) {
                        attrs2.className = `${className} ${attrs2.className}`;
                    }

                    // Modifying args array is ugly but runs faster than other solutions
                    args[0] = tag;
                    args[1] = attrs2;
                    currElem = createElement(...args);
                } else {
                    const args2 = [tag, attrs2];

                    for (let i = 1; i < args.length; ++i) {
                        args2.push(args[i]);                    
                    }

                    currElem = createElement(...args2);

/*                    
                    args[0] = tag;
                    args.push(null);

                    const length = args.length;

                    for (let i = 1; i < args.length; ++i) {
                        args[length - i] = args[length - i - 1]; 
                    }

                    args[1] = attrs2;
                    
                    currElem = createElement(...args);
*/
                }
            }
        } 

        return currElem;
    }
}
