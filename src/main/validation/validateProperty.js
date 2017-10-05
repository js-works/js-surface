import { SpecValidator } from 'js-spec';

export default function validateProperty(it, propertyName, typeConstr, nullable, constraint) {
    let
        ret = null,
        errMsg = null;
    
    if (it === null && !nullable) {
        errMsg = `Property '${propertyName}' must not be null`;
    } else if (typeConstr !== undefined && typeConstr !== null) {
        const type = typeof it;
        
        switch (typeConstr) {
            case Boolean:
                if (type !== 'boolean') {
                   errMsg = `Property '${propertyName}' must be boolean`;
                }
                
                break;
                
            case Number:
                if (type !== 'number') {
                   errMsg = `Property '${propertyName}' must be a number`;
                }
                
                break;
            
            case String:
                if (type !== 'string') {
                   errMsg = `Property '${propertyName}' must be a string`;
                }
                
                break;
                
            case Function:
                if (type !== 'function') {
                   errMsg = `Property '${propertyName}' must be a function`;
                }
                
                break;
                
            default:
                if (!(it instanceof typeConstr)) {
                    errMsg = `The property '${propertyName}' must be of type '`
                        + typeConstr.name + "'";
                }
        }
        
        if (!errMsg && constraint) {
            let err =
                constraint instanceof SpecValidator
                ? constraint.validate(it, '')
                : constraint(it);
            
            if (err === false) {
                errMsg = `Illegal value for property '${propertyName}'`;
            } else if (typeof err === 'string') {
                errMsg = `Invalid value for property '${propertyName}' => ${err}`;
            } else if (err && typeof err.message === 'string') {
                errMsg = `Invalid value for property '${propertyName}' => `
                    + err.message;
            } else {
                errMsg = String(err);
            }
        }
        
        
        if (errMsg) {
            ret = new Error(errMsg);
        } 
    }
    
    return ret;
}