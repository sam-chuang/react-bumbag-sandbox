import { r as react } from './common/index-50b0b662.js';

var isCheckBoxInput = (element) => element.type === 'checkbox';

var isNullOrUndefined = (value) => value == null;

const isObjectType = (value) => typeof value === 'object';
var isObject = (value) => !isNullOrUndefined(value) &&
    !Array.isArray(value) &&
    isObjectType(value) &&
    !(value instanceof Date);

var getNodeParentName = (name) => name.substring(0, name.search(/.\d/)) || name;

var compact = (value) => value.filter(Boolean);

var isUndefined = (val) => val === undefined;

var get = (obj = {}, path, defaultValue) => {
    const result = compact(path.split(/[,[\].]+?/)).reduce((result, key) => (isNullOrUndefined(result) ? result : result[key]), obj);
    return isUndefined(result) || result === obj
        ? isUndefined(obj[path])
            ? defaultValue
            : obj[path]
        : result;
};

const EVENTS = {
    BLUR: 'blur',
    CHANGE: 'change',
};
const VALIDATION_MODE = {
    onBlur: 'onBlur',
    onChange: 'onChange',
    onSubmit: 'onSubmit',
    onTouched: 'onTouched',
    all: 'all',
};
const SELECT = 'select';
const UNDEFINED = 'undefined';
const INPUT_VALIDATION_RULES = {
    max: 'max',
    min: 'min',
    maxLength: 'maxLength',
    minLength: 'minLength',
    pattern: 'pattern',
    required: 'required',
    validate: 'validate',
};

var omit = (source, key) => {
    const copy = Object.assign({}, source);
    delete copy[key];
    return copy;
};

const FormContext = react.createContext(null);
FormContext.displayName = 'RHFContext';
const useFormContext = () => react.useContext(FormContext);
const FormProvider = (props) => (react.createElement(FormContext.Provider, { value: omit(props, 'children') }, props.children));

var getProxyFormState = (isProxyEnabled, formState, readFormStateRef, localReadFormStateRef, isRoot = true) => isProxyEnabled
    ? new Proxy(formState, {
        get: (obj, prop) => {
            if (prop in obj) {
                if (readFormStateRef.current[prop] !== VALIDATION_MODE.all) {
                    readFormStateRef.current[prop] = isRoot
                        ? VALIDATION_MODE.all
                        : true;
                }
                localReadFormStateRef &&
                    (localReadFormStateRef.current[prop] = true);
                return obj[prop];
            }
            return undefined;
        },
    })
    : formState;

var isEmptyObject = (value) => isObject(value) && !Object.keys(value).length;

var shouldRenderFormState = (formState, readFormStateRef, isRoot) => isEmptyObject(formState) ||
    Object.keys(formState).length >= Object.keys(readFormStateRef).length ||
    Object.keys(formState).find((key) => readFormStateRef[key] ===
        (isRoot ? VALIDATION_MODE.all : true));

var isWeb = typeof window !== UNDEFINED &&
    typeof window.HTMLElement !== UNDEFINED &&
    typeof document !== UNDEFINED;

const isProxyEnabled = isWeb ? 'Proxy' in window : typeof Proxy !== UNDEFINED;

var appendErrors = (name, validateAllFieldCriteria, errors, type, message) => validateAllFieldCriteria
    ? Object.assign(Object.assign({}, errors[name]), { types: Object.assign(Object.assign({}, (errors[name] && errors[name].types ? errors[name].types : {})), { [type]: message || true }) }) : {};

var isKey = (value) => /^\w*$/.test(value);

var stringToPath = (input) => compact(input.replace(/["|']|\]/g, '').split(/\.|\[/));

function set(object, path, value) {
    let index = -1;
    const tempPath = isKey(path) ? [path] : stringToPath(path);
    const length = tempPath.length;
    const lastIndex = length - 1;
    while (++index < length) {
        const key = tempPath[index];
        let newValue = value;
        if (index !== lastIndex) {
            const objValue = object[key];
            newValue =
                isObject(objValue) || Array.isArray(objValue)
                    ? objValue
                    : !isNaN(+tempPath[index + 1])
                        ? []
                        : {};
        }
        object[key] = newValue;
        object = object[key];
    }
    return object;
}

const focusFieldBy = (fields, callback, fieldsNames) => {
    for (const key of fieldsNames || Object.keys(fields)) {
        const field = get(fields, key);
        if (field) {
            const _f = field._f;
            const current = omit(field, '_f');
            if (_f && callback(_f.name)) {
                if (_f.ref.focus && isUndefined(_f.ref.focus())) {
                    break;
                }
                else if (_f.refs) {
                    _f.refs[0].focus();
                    break;
                }
            }
            else if (isObject(current)) {
                focusFieldBy(current, callback);
            }
        }
    }
};

const getFieldsValues = (fieldsRef, defaultValuesRef = { current: {} }, output = {}) => {
    for (const name in fieldsRef.current) {
        const field = fieldsRef.current[name];
        if (field) {
            const _f = field._f;
            const current = omit(field, '_f');
            set(output, name, _f
                ? _f.ref.disabled || (_f.refs && _f.refs.every((ref) => ref.disabled))
                    ? undefined
                    : _f.value
                : Array.isArray(field)
                    ? []
                    : {});
            if (current) {
                getFieldsValues({
                    current,
                }, defaultValuesRef, output[name]);
            }
        }
    }
    return Object.assign(Object.assign({}, defaultValuesRef.current), output);
};

var isPrimitive = (value) => isNullOrUndefined(value) || !isObjectType(value);

function deepEqual(object1, object2, isErrorObject) {
    if (isPrimitive(object1) ||
        isPrimitive(object2) ||
        object1 instanceof Date ||
        object2 instanceof Date) {
        return object1 === object2;
    }
    if (!react.isValidElement(object1)) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            const val1 = object1[key];
            if (!(isErrorObject && key === 'ref')) {
                const val2 = object2[key];
                if ((isObject(val1) || Array.isArray(val1)) &&
                    (isObject(val2) || Array.isArray(val2))
                    ? !deepEqual(val1, val2, isErrorObject)
                    : val1 !== val2) {
                    return false;
                }
            }
        }
    }
    return true;
}

function deepMerge(target, source) {
    if (isPrimitive(target) || isPrimitive(source)) {
        return source;
    }
    for (const key in source) {
        const targetValue = target[key];
        const sourceValue = source[key];
        try {
            target[key] =
                (isObject(targetValue) && isObject(sourceValue)) ||
                    (Array.isArray(targetValue) && Array.isArray(sourceValue))
                    ? deepMerge(targetValue, sourceValue)
                    : sourceValue;
        }
        catch (_a) { }
    }
    return target;
}

function setDirtyFields(values, defaultValues, dirtyFields, parentNode, parentName) {
    let index = -1;
    while (++index < values.length) {
        for (const key in values[index]) {
            if (Array.isArray(values[index][key])) {
                !dirtyFields[index] && (dirtyFields[index] = {});
                dirtyFields[index][key] = [];
                setDirtyFields(values[index][key], get(defaultValues[index] || {}, key, []), dirtyFields[index][key], dirtyFields[index], key);
            }
            else {
                deepEqual(get(defaultValues[index] || {}, key), values[index][key])
                    ? set(dirtyFields[index] || {}, key)
                    : (dirtyFields[index] = Object.assign(Object.assign({}, dirtyFields[index]), { [key]: true }));
            }
        }
        parentNode &&
            !dirtyFields.length &&
            delete parentNode[parentName];
    }
    return dirtyFields;
}
var setFieldArrayDirtyFields = (values, defaultValues, dirtyFields) => deepMerge(setDirtyFields(values, defaultValues, dirtyFields.slice(0, values.length)), setDirtyFields(defaultValues, values, dirtyFields.slice(0, values.length)));

var isBoolean = (value) => typeof value === 'boolean';

function baseGet(object, updatePath) {
    const length = updatePath.slice(0, -1).length;
    let index = 0;
    while (index < length) {
        object = isUndefined(object) ? index++ : object[updatePath[index++]];
    }
    return object;
}
function unset(object, path) {
    const updatePath = isKey(path) ? [path] : stringToPath(path);
    const childObject = updatePath.length == 1 ? object : baseGet(object, updatePath);
    const key = updatePath[updatePath.length - 1];
    let previousObjRef;
    if (childObject) {
        delete childObject[key];
    }
    for (let k = 0; k < updatePath.slice(0, -1).length; k++) {
        let index = -1;
        let objectRef;
        const currentPaths = updatePath.slice(0, -(k + 1));
        const currentPathsLength = currentPaths.length - 1;
        if (k > 0) {
            previousObjRef = object;
        }
        while (++index < currentPaths.length) {
            const item = currentPaths[index];
            objectRef = objectRef ? objectRef[item] : object[item];
            if (currentPathsLength === index &&
                ((isObject(objectRef) && isEmptyObject(objectRef)) ||
                    (Array.isArray(objectRef) &&
                        !objectRef.filter((data) => (isObject(data) && !isEmptyObject(data)) || isBoolean(data)).length))) {
                previousObjRef ? delete previousObjRef[item] : delete object[item];
            }
            previousObjRef = objectRef;
        }
    }
    return object;
}

function getFields(fieldsNames, fieldsRefs) {
    const currentFields = {};
    for (const name of fieldsNames) {
        const field = get(fieldsRefs, name);
        if (field) {
            !isKey(name)
                ? set(currentFields, name, field._f)
                : (currentFields[name] = field._f);
        }
    }
    return currentFields;
}

var isFileInput = (element) => element.type === 'file';

var isMultipleSelect = (element) => element.type === `${SELECT}-multiple`;

var isRadioInput = (element) => element.type === 'radio';

const defaultResult = {
    value: false,
    isValid: false,
};
const validResult = { value: true, isValid: true };
var getCheckboxValue = (options) => {
    if (Array.isArray(options)) {
        if (options.length > 1) {
            const values = options
                .filter((option) => option && option.checked && !option.disabled)
                .map((option) => option.value);
            return { value: values, isValid: !!values.length };
        }
        return options[0].checked && !options[0].disabled
            ? // @ts-expect-error expected to work in the browser
                options[0].attributes && !isUndefined(options[0].attributes.value)
                    ? isUndefined(options[0].value) || options[0].value === ''
                        ? validResult
                        : { value: options[0].value, isValid: true }
                    : validResult
            : defaultResult;
    }
    return defaultResult;
};

var getFieldValueAs = (value, { valueAsNumber, valueAsDate, setValueAs }) => valueAsNumber
    ? value === ''
        ? NaN
        : +value
    : valueAsDate
        ? new Date(value)
        : setValueAs
            ? setValueAs(value)
            : value;

var getMultipleSelectValue = (options) => [...options]
    .filter(({ selected }) => selected)
    .map(({ value }) => value);

const defaultReturn = {
    isValid: false,
    value: null,
};
var getRadioValue = (options) => Array.isArray(options)
    ? options.reduce((previous, option) => option && option.checked && !option.disabled
        ? {
            isValid: true,
            value: option.value,
        }
        : previous, defaultReturn)
    : defaultReturn;

function getFieldValue(field) {
    if (field && field._f) {
        const ref = field._f.ref;
        if (ref.disabled) {
            return;
        }
        if (isFileInput(ref)) {
            return ref.files;
        }
        if (isRadioInput(ref)) {
            return getRadioValue(field._f.refs).value;
        }
        if (isMultipleSelect(ref)) {
            return getMultipleSelectValue(ref.options);
        }
        if (isCheckBoxInput(ref)) {
            return getCheckboxValue(field._f.refs).value;
        }
        return getFieldValueAs(isUndefined(ref.value) ? field._f.ref.value : ref.value, field._f);
    }
}

var isErrorStateChanged = ({ errors, name, error, validFields, fieldsWithValidation, }) => {
    const isValid = isUndefined(error);
    const previousError = get(errors, name);
    return ((isValid && !!previousError) ||
        (!isValid && !deepEqual(previousError, error, true)) ||
        (isValid && get(fieldsWithValidation, name) && !get(validFields, name)));
};

var skipValidation = ({ isOnBlur, isOnChange, isOnTouch, isTouched, isReValidateOnBlur, isReValidateOnChange, isBlurEvent, isSubmitted, isOnAll, }) => {
    if (isOnAll) {
        return false;
    }
    else if (!isSubmitted && isOnTouch) {
        return !(isTouched || isBlurEvent);
    }
    else if (isSubmitted ? isReValidateOnBlur : isOnBlur) {
        return !isBlurEvent;
    }
    else if (isSubmitted ? isReValidateOnChange : isOnChange) {
        return isBlurEvent;
    }
    return true;
};

var isFunction = (value) => typeof value === 'function';

var isString = (value) => typeof value === 'string';

var isMessage = (value) => isString(value) || react.isValidElement(value);

var isRegex = (value) => value instanceof RegExp;

function getValidateError(result, ref, type = 'validate') {
    if (isMessage(result) || (isBoolean(result) && !result)) {
        return {
            type,
            message: isMessage(result) ? result : '',
            ref,
        };
    }
}

var getValueAndMessage = (validationData) => isObject(validationData) && !isRegex(validationData)
    ? validationData
    : {
        value: validationData,
        message: '',
    };

var validateField = async ({ _f: { ref, refs, required, maxLength, minLength, min, max, pattern, validate, name, value: inputValue, valueAsNumber, }, }, validateAllFieldCriteria) => {
    const error = {};
    const isRadio = isRadioInput(ref);
    const isCheckBox = isCheckBoxInput(ref);
    const isRadioOrCheckbox = isRadio || isCheckBox;
    const isEmpty = (valueAsNumber && ref.value === '') ||
        inputValue === '' ||
        (Array.isArray(inputValue) && !inputValue.length);
    const appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
    const getMinMaxMessage = (exceedMax, maxLengthMessage, minLengthMessage, maxType = INPUT_VALIDATION_RULES.maxLength, minType = INPUT_VALIDATION_RULES.minLength) => {
        const message = exceedMax ? maxLengthMessage : minLengthMessage;
        error[name] = Object.assign({ type: exceedMax ? maxType : minType, message,
            ref }, appendErrorsCurry(exceedMax ? maxType : minType, message));
    };
    if (required &&
        ((!isRadio && !isCheckBox && (isEmpty || isNullOrUndefined(inputValue))) ||
            (isBoolean(inputValue) && !inputValue) ||
            (isCheckBox && !getCheckboxValue(refs).isValid) ||
            (isRadio && !getRadioValue(refs).isValid))) {
        const { value, message } = isMessage(required)
            ? { value: !!required, message: required }
            : getValueAndMessage(required);
        if (value) {
            error[name] = Object.assign({ type: INPUT_VALIDATION_RULES.required, message, ref: isRadioOrCheckbox ? (refs || [])[0] || {} : ref }, appendErrorsCurry(INPUT_VALIDATION_RULES.required, message));
            if (!validateAllFieldCriteria) {
                return error;
            }
        }
    }
    if ((!isNullOrUndefined(min) || !isNullOrUndefined(max)) &&
        inputValue !== '') {
        let exceedMax;
        let exceedMin;
        const maxOutput = getValueAndMessage(max);
        const minOutput = getValueAndMessage(min);
        if (!isNaN(inputValue)) {
            const valueNumber = ref.valueAsNumber || parseFloat(inputValue);
            if (!isNullOrUndefined(maxOutput.value)) {
                exceedMax = valueNumber > maxOutput.value;
            }
            if (!isNullOrUndefined(minOutput.value)) {
                exceedMin = valueNumber < minOutput.value;
            }
        }
        else {
            const valueDate = ref.valueAsDate || new Date(inputValue);
            if (isString(maxOutput.value)) {
                exceedMax = valueDate > new Date(maxOutput.value);
            }
            if (isString(minOutput.value)) {
                exceedMin = valueDate < new Date(minOutput.value);
            }
        }
        if (exceedMax || exceedMin) {
            getMinMaxMessage(!!exceedMax, maxOutput.message, minOutput.message, INPUT_VALIDATION_RULES.max, INPUT_VALIDATION_RULES.min);
            if (!validateAllFieldCriteria) {
                return error;
            }
        }
    }
    if (isString(inputValue) && !isEmpty && (maxLength || minLength)) {
        const maxLengthOutput = getValueAndMessage(maxLength);
        const minLengthOutput = getValueAndMessage(minLength);
        const exceedMax = !isNullOrUndefined(maxLengthOutput.value) &&
            inputValue.length > maxLengthOutput.value;
        const exceedMin = !isNullOrUndefined(minLengthOutput.value) &&
            inputValue.length < minLengthOutput.value;
        if (exceedMax || exceedMin) {
            getMinMaxMessage(exceedMax, maxLengthOutput.message, minLengthOutput.message);
            if (!validateAllFieldCriteria) {
                return error;
            }
        }
    }
    if (isString(inputValue) && pattern && !isEmpty) {
        const { value: patternValue, message } = getValueAndMessage(pattern);
        if (isRegex(patternValue) && !patternValue.test(inputValue)) {
            error[name] = Object.assign({ type: INPUT_VALIDATION_RULES.pattern, message,
                ref }, appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, message));
            if (!validateAllFieldCriteria) {
                return error;
            }
        }
    }
    if (validate) {
        const validateRef = isRadioOrCheckbox && refs ? refs[0] : ref;
        if (isFunction(validate)) {
            const result = await validate(inputValue);
            const validateError = getValidateError(result, validateRef);
            if (validateError) {
                error[name] = Object.assign(Object.assign({}, validateError), appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message));
                if (!validateAllFieldCriteria) {
                    return error;
                }
            }
        }
        else if (isObject(validate)) {
            let validationResult = {};
            for (const [key, validateFunction] of Object.entries(validate)) {
                if (!isEmptyObject(validationResult) && !validateAllFieldCriteria) {
                    break;
                }
                const validateResult = await validateFunction(inputValue);
                const validateError = getValidateError(validateResult, validateRef, key);
                if (validateError) {
                    validationResult = Object.assign(Object.assign({}, validateError), appendErrorsCurry(key, validateError.message));
                    if (validateAllFieldCriteria) {
                        error[name] = validationResult;
                    }
                }
            }
            if (!isEmptyObject(validationResult)) {
                error[name] = Object.assign({ ref: validateRef }, validationResult);
                if (!validateAllFieldCriteria) {
                    return error;
                }
            }
        }
    }
    return error;
};

var getValidationModes = (mode) => ({
    isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
    isOnBlur: mode === VALIDATION_MODE.onBlur,
    isOnChange: mode === VALIDATION_MODE.onChange,
    isOnAll: mode === VALIDATION_MODE.all,
    isOnTouch: mode === VALIDATION_MODE.onTouched,
});

var isHTMLElement = (value) => value instanceof HTMLElement;

var isRadioOrCheckboxFunction = (ref) => isRadioInput(ref) || isCheckBoxInput(ref);

class Subscription {
    constructor() {
        this.tearDowns = [];
    }
    add(tearDown) {
        this.tearDowns.push(tearDown);
    }
    unsubscribe() {
        for (const teardown of this.tearDowns) {
            teardown();
        }
        this.tearDowns = [];
    }
}
class Subscriber {
    constructor(observer, subscription) {
        this.observer = observer;
        this.closed = false;
        subscription.add(() => (this.closed = true));
    }
    next(value) {
        if (!this.closed) {
            this.observer.next(value);
        }
    }
}
class Subject {
    constructor() {
        this.observers = [];
    }
    next(value) {
        for (const observer of this.observers) {
            observer.next(value);
        }
    }
    subscribe(observer) {
        const subscription = new Subscription();
        const subscriber = new Subscriber(observer, subscription);
        this.observers.push(subscriber);
        return subscription;
    }
    unsubscribe() {
        this.observers = [];
    }
}

const isWindowUndefined = typeof window === UNDEFINED;
function useForm({ mode = VALIDATION_MODE.onSubmit, reValidateMode = VALIDATION_MODE.onChange, resolver, context, defaultValues = {}, shouldFocusError = true, criteriaMode, } = {}) {
    const fieldsRef = react.useRef({});
    const fieldsNamesRef = react.useRef(new Set());
    const formStateSubjectRef = react.useRef(new Subject());
    const watchSubjectRef = react.useRef(new Subject());
    const controllerSubjectRef = react.useRef(new Subject());
    const fieldArraySubjectRef = react.useRef(new Subject());
    const fieldArrayDefaultValuesRef = react.useRef({});
    const watchFieldsRef = react.useRef(new Set());
    const isMountedRef = react.useRef(false);
    const fieldsWithValidationRef = react.useRef({});
    const validFieldsRef = react.useRef({});
    const defaultValuesRef = react.useRef(defaultValues);
    const isWatchAllRef = react.useRef(false);
    const contextRef = react.useRef(context);
    const resolverRef = react.useRef(resolver);
    const fieldArrayNamesRef = react.useRef(new Set());
    const validationMode = getValidationModes(mode);
    const isValidateAllFieldCriteria = criteriaMode === VALIDATION_MODE.all;
    const [formState, setFormState] = react.useState({
        isDirty: false,
        isValidating: false,
        dirtyFields: {},
        isSubmitted: false,
        submitCount: 0,
        touchedFields: {},
        isSubmitting: false,
        isSubmitSuccessful: false,
        isValid: !validationMode.isOnSubmit,
        errors: {},
    });
    const readFormStateRef = react.useRef({
        isDirty: !isProxyEnabled,
        dirtyFields: !isProxyEnabled,
        touchedFields: !isProxyEnabled,
        isValidating: !isProxyEnabled,
        isValid: !isProxyEnabled,
        errors: !isProxyEnabled,
    });
    const formStateRef = react.useRef(formState);
    contextRef.current = context;
    resolverRef.current = resolver;
    const getIsValid = () => (formStateRef.current.isValid =
        deepEqual(validFieldsRef.current, fieldsWithValidationRef.current) &&
            isEmptyObject(formStateRef.current.errors));
    const shouldRenderBaseOnError = react.useCallback((name, error, shouldRender = false, state = {}, isValid, isWatched) => {
        let shouldReRender = shouldRender ||
            isErrorStateChanged({
                errors: formStateRef.current.errors,
                error,
                name,
                validFields: validFieldsRef.current,
                fieldsWithValidation: fieldsWithValidationRef.current,
            });
        const previousError = get(formStateRef.current.errors, name);
        if (error) {
            unset(validFieldsRef.current, name);
            shouldReRender =
                shouldReRender ||
                    !previousError ||
                    !deepEqual(previousError, error, true);
            set(formStateRef.current.errors, name, error);
        }
        else {
            if (get(fieldsWithValidationRef.current, name) || resolverRef.current) {
                set(validFieldsRef.current, name, true);
                shouldReRender = shouldReRender || previousError;
            }
            unset(formStateRef.current.errors, name);
        }
        if ((shouldReRender && !isNullOrUndefined(shouldRender)) ||
            !isEmptyObject(state) ||
            isWatched) {
            const updatedFormState = Object.assign(Object.assign({}, state), { isValid: resolverRef.current ? !!isValid : getIsValid(), errors: formStateRef.current.errors });
            formStateRef.current = Object.assign(Object.assign({}, formStateRef.current), updatedFormState);
            formStateSubjectRef.current.next(isWatched ? {} : updatedFormState);
        }
        formStateSubjectRef.current.next({
            isValidating: false,
        });
    }, []);
    const setFieldValue = react.useCallback((name, rawValue, options = {}, shouldRender, shouldRegister) => {
        shouldRegister && register(name);
        const _f = get(fieldsRef.current, name, {})._f;
        if (_f) {
            const value = isWeb && isHTMLElement(_f.ref) && isNullOrUndefined(rawValue)
                ? ''
                : rawValue;
            _f.value = rawValue;
            if (isRadioInput(_f.ref)) {
                (_f.refs || []).forEach((radioRef) => (radioRef.checked = radioRef.value === value));
            }
            else if (isFileInput(_f.ref) && !isString(value)) {
                _f.ref.files = value;
            }
            else if (isMultipleSelect(_f.ref)) {
                [..._f.ref.options].forEach((selectRef) => (selectRef.selected = value.includes(selectRef.value)));
            }
            else if (isCheckBoxInput(_f.ref) && _f.refs) {
                _f.refs.length > 1
                    ? _f.refs.forEach((checkboxRef) => (checkboxRef.checked = Array.isArray(value)
                        ? !!value.find((data) => data === checkboxRef.value)
                        : value === checkboxRef.value))
                    : (_f.refs[0].checked = !!value);
            }
            else {
                _f.ref.value = value;
            }
            if (shouldRender) {
                const values = getFieldsValues(fieldsRef);
                set(values, name, rawValue);
                controllerSubjectRef.current.next({
                    values: Object.assign(Object.assign({}, defaultValuesRef.current), values),
                    name,
                });
            }
            options.shouldDirty && updateAndGetDirtyState(name, value);
            options.shouldValidate && trigger(name);
        }
    }, []);
    const getFormIsDirty = react.useCallback((name, data) => {
        if (readFormStateRef.current.isDirty) {
            const formValues = getFieldsValues(fieldsRef);
            name && data && set(formValues, name, data);
            return !deepEqual(formValues, defaultValuesRef.current);
        }
        return false;
    }, []);
    const updateAndGetDirtyState = react.useCallback((name, inputValue, shouldRender = true) => {
        if (readFormStateRef.current.isDirty ||
            readFormStateRef.current.dirtyFields) {
            const isFieldDirty = !deepEqual(get(defaultValuesRef.current, name), inputValue);
            const isDirtyFieldExist = get(formStateRef.current.dirtyFields, name);
            const previousIsDirty = formStateRef.current.isDirty;
            isFieldDirty
                ? set(formStateRef.current.dirtyFields, name, true)
                : unset(formStateRef.current.dirtyFields, name);
            formStateRef.current.isDirty = getFormIsDirty();
            const state = {
                isDirty: formStateRef.current.isDirty,
                dirtyFields: formStateRef.current.dirtyFields,
            };
            const isChanged = (readFormStateRef.current.isDirty &&
                previousIsDirty !== state.isDirty) ||
                (readFormStateRef.current.dirtyFields &&
                    isDirtyFieldExist !== get(formStateRef.current.dirtyFields, name));
            isChanged && shouldRender && formStateSubjectRef.current.next(state);
            return isChanged ? state : {};
        }
        return {};
    }, []);
    const executeValidation = react.useCallback(async (name, skipReRender) => {
        const error = (await validateField(get(fieldsRef.current, name), isValidateAllFieldCriteria))[name];
        shouldRenderBaseOnError(name, error, skipReRender);
        return isUndefined(error);
    }, [isValidateAllFieldCriteria]);
    const executeSchemaOrResolverValidation = react.useCallback(async (names, currentNames = []) => {
        const { errors } = await resolverRef.current(getFieldsValues(fieldsRef, defaultValuesRef), contextRef.current, {
            criteriaMode,
            names: currentNames,
            fields: getFields(fieldsNamesRef.current, fieldsRef.current),
        });
        for (const name of names) {
            const error = get(errors, name);
            error
                ? set(formStateRef.current.errors, name, error)
                : unset(formStateRef.current.errors, name);
        }
        return errors;
    }, [criteriaMode]);
    const validateForm = async (fieldsRef) => {
        for (const name in fieldsRef) {
            const field = fieldsRef[name];
            if (field) {
                const _f = field._f;
                const current = omit(field, '_f');
                if (_f) {
                    const fieldError = await validateField(field, isValidateAllFieldCriteria);
                    if (fieldError[_f.name]) {
                        set(formStateRef.current.errors, _f.name, fieldError[_f.name]);
                        unset(validFieldsRef.current, _f.name);
                    }
                    else if (get(fieldsWithValidationRef.current, _f.name)) {
                        set(validFieldsRef.current, _f.name, true);
                        unset(formStateRef.current.errors, _f.name);
                    }
                }
                current && (await validateForm(current));
            }
        }
    };
    const trigger = react.useCallback(async (name) => {
        const fields = isUndefined(name)
            ? Object.keys(fieldsRef.current)
            : Array.isArray(name)
                ? name
                : [name];
        let isValid;
        formStateSubjectRef.current.next({
            isValidating: true,
        });
        if (resolverRef.current) {
            isValid = isEmptyObject(await executeSchemaOrResolverValidation(fields, isUndefined(name)
                ? undefined
                : fields));
        }
        else {
            isUndefined(name)
                ? await validateForm(fieldsRef.current)
                : await Promise.all(fields.map(async (data) => await executeValidation(data, null)));
        }
        formStateSubjectRef.current.next({
            errors: formStateRef.current.errors,
            isValidating: false,
            isValid: resolverRef.current ? isValid : getIsValid(),
        });
    }, [executeSchemaOrResolverValidation, executeValidation]);
    const setInternalValues = react.useCallback((name, value, options) => Object.entries(value).forEach(([inputKey, inputValue]) => {
        const fieldName = `${name}.${inputKey}`;
        const field = get(fieldsRef.current, fieldName);
        field && !field._f
            ? setInternalValues(fieldName, inputValue, options)
            : setFieldValue(fieldName, inputValue, options, true, !field);
    }), [trigger]);
    const isFieldWatched = (name) => isWatchAllRef.current ||
        watchFieldsRef.current.has(name) ||
        watchFieldsRef.current.has((name.match(/\w+/) || [])[0]);
    const updateValueAndGetDefault = (name) => {
        let defaultValue;
        const field = get(fieldsRef.current, name);
        if (field &&
            (!isEmptyObject(defaultValuesRef.current) || !isUndefined(field._f.value))) {
            defaultValue = isUndefined(field._f.value)
                ? get(defaultValuesRef.current, name)
                : field._f.value;
            if (!isUndefined(defaultValue)) {
                setFieldValue(name, defaultValue);
            }
        }
        return defaultValue;
    };
    const setValue = (name, value, options = {}) => {
        isMountedRef.current = true;
        const field = get(fieldsRef.current, name);
        const isFieldArray = fieldArrayNamesRef.current.has(name);
        if (isFieldArray) {
            fieldArraySubjectRef.current.next({
                fields: value,
                name,
                isReset: true,
            });
            if ((readFormStateRef.current.isDirty ||
                readFormStateRef.current.dirtyFields) &&
                options.shouldDirty) {
                set(formStateRef.current.dirtyFields, name, setFieldArrayDirtyFields(value, get(defaultValuesRef.current, name, []), get(formStateRef.current.dirtyFields, name, [])));
                formStateSubjectRef.current.next({
                    dirtyFields: formStateRef.current.dirtyFields,
                    isDirty: getFormIsDirty(name, value),
                });
            }
            !value.length &&
                set(fieldsRef.current, name, []) &&
                set(fieldArrayDefaultValuesRef.current, name, []);
        }
        (field && !field._f) || isFieldArray
            ? setInternalValues(name, value, isFieldArray ? {} : options)
            : setFieldValue(name, value, options, true, !field);
        isFieldWatched(name) && formStateSubjectRef.current.next({});
        watchSubjectRef.current.next({ name, value });
    };
    const handleChange = react.useCallback(async ({ type, target, target: { value, type: inputType } }) => {
        let name = target.name;
        let error;
        let isValid;
        const field = get(fieldsRef.current, name);
        if (field) {
            const inputValue = inputType ? getFieldValue(field) : value;
            const isBlurEvent = type === EVENTS.BLUR;
            const { isOnBlur: isReValidateOnBlur, isOnChange: isReValidateOnChange, } = getValidationModes(reValidateMode);
            const shouldSkipValidation = skipValidation(Object.assign({ isBlurEvent, isTouched: !!get(formStateRef.current.touchedFields, name), isSubmitted: formStateRef.current.isSubmitted, isReValidateOnBlur,
                isReValidateOnChange }, validationMode));
            const isWatched = !isBlurEvent && isFieldWatched(name);
            if (!isUndefined(inputValue)) {
                field._f.value = inputValue;
            }
            const state = updateAndGetDirtyState(name, field._f.value, false);
            if (isBlurEvent && !get(formStateRef.current.touchedFields, name)) {
                set(formStateRef.current.touchedFields, name, true);
                state.touchedFields = formStateRef.current.touchedFields;
            }
            let shouldRender = !isEmptyObject(state) || isWatched;
            if (shouldSkipValidation) {
                !isBlurEvent &&
                    watchSubjectRef.current.next({
                        name,
                        type,
                        value: inputValue,
                    });
                return (shouldRender &&
                    formStateSubjectRef.current.next(isWatched ? {} : state));
            }
            formStateSubjectRef.current.next({
                isValidating: true,
            });
            if (resolverRef.current) {
                const { errors } = await resolverRef.current(getFieldsValues(fieldsRef, defaultValuesRef), contextRef.current, {
                    criteriaMode,
                    fields: getFields([name], fieldsRef.current),
                    names: [name],
                });
                const previousFormIsValid = formStateRef.current.isValid;
                error = get(errors, name);
                if (isCheckBoxInput(target) && !error) {
                    const parentNodeName = getNodeParentName(name);
                    const currentError = get(errors, parentNodeName, {});
                    currentError.type && currentError.message && (error = currentError);
                    if (currentError ||
                        get(formStateRef.current.errors, parentNodeName)) {
                        name = parentNodeName;
                    }
                }
                isValid = isEmptyObject(errors);
                previousFormIsValid !== isValid && (shouldRender = true);
            }
            else {
                error = (await validateField(field, isValidateAllFieldCriteria))[name];
            }
            !isBlurEvent &&
                watchSubjectRef.current.next({
                    name,
                    type,
                    value: inputValue,
                });
            shouldRenderBaseOnError(name, error, shouldRender, state, isValid, isWatched);
        }
    }, []);
    const getValues = (fieldNames) => {
        const values = isMountedRef.current
            ? getFieldsValues(fieldsRef, defaultValuesRef)
            : defaultValuesRef.current;
        return isUndefined(fieldNames)
            ? values
            : isString(fieldNames)
                ? get(values, fieldNames)
                : fieldNames.map((name) => get(values, name));
    };
    const updateIsValid = react.useCallback(async (values = {}) => {
        const previousIsValid = formStateRef.current.isValid;
        if (resolver) {
            const { errors } = await resolverRef.current(Object.assign(Object.assign({}, getFieldsValues(fieldsRef, defaultValuesRef)), values), contextRef.current, {
                criteriaMode,
                fields: getFields(fieldsNamesRef.current, fieldsRef.current),
            });
            formStateRef.current.isValid = isEmptyObject(errors);
        }
        else {
            getIsValid();
        }
        previousIsValid !== formStateRef.current.isValid &&
            formStateSubjectRef.current.next({
                isValid: formStateRef.current.isValid,
            });
    }, [criteriaMode]);
    const clearErrors = (name) => {
        name &&
            (Array.isArray(name) ? name : [name]).forEach((inputName) => unset(formStateRef.current.errors, inputName));
        formStateSubjectRef.current.next({
            errors: name ? formStateRef.current.errors : {},
        });
    };
    const setError = (name, error, options) => {
        const ref = ((get(fieldsRef.current, name) || { _f: {} })._f || {}).ref;
        set(formStateRef.current.errors, name, Object.assign(Object.assign({}, error), { ref }));
        formStateSubjectRef.current.next({
            errors: formStateRef.current.errors,
            isValid: false,
        });
        options && options.shouldFocus && ref && ref.focus && ref.focus();
    };
    const watchInternal = react.useCallback((fieldNames, defaultValue, isGlobal) => {
        const isArrayNames = Array.isArray(fieldNames);
        const fieldValues = isMountedRef.current
            ? getValues()
            : isUndefined(defaultValue)
                ? defaultValuesRef.current
                : isArrayNames
                    ? defaultValue || {}
                    : { [fieldNames]: defaultValue };
        if (isUndefined(fieldNames)) {
            isGlobal && (isWatchAllRef.current = true);
            return fieldValues;
        }
        const result = [];
        for (const fieldName of isArrayNames ? fieldNames : [fieldNames]) {
            isGlobal && watchFieldsRef.current.add(fieldName);
            result.push(get(fieldValues, fieldName));
        }
        return isArrayNames ? result : result[0];
    }, []);
    const watch = (fieldName, defaultValue) => isFunction(fieldName)
        ? watchSubjectRef.current.subscribe({
            next: (info) => fieldName(watchInternal(undefined, defaultValue), info),
        })
        : watchInternal(fieldName, defaultValue, true);
    const unregister = (name, options = {}) => {
        for (const inputName of name
            ? Array.isArray(name)
                ? name
                : [name]
            : Object.keys(fieldsNamesRef.current)) {
            fieldsNamesRef.current.delete(inputName);
            fieldArrayNamesRef.current.delete(inputName);
            if (get(fieldsRef.current, inputName)) {
                if (!options.keepIsValid) {
                    unset(fieldsWithValidationRef.current, inputName);
                    unset(validFieldsRef.current, inputName);
                }
                !options.keepError && unset(formStateRef.current.errors, inputName);
                !options.keepValue && unset(fieldsRef.current, inputName);
                !options.keepDirty &&
                    unset(formStateRef.current.dirtyFields, inputName);
                !options.keepTouched &&
                    unset(formStateRef.current.touchedFields, inputName);
                !options.keepDefaultValue && unset(defaultValuesRef.current, inputName);
                watchSubjectRef.current.next({
                    name: inputName,
                });
            }
        }
        formStateSubjectRef.current.next(Object.assign(Object.assign(Object.assign({}, formStateRef.current), (!options.keepDirty ? {} : { isDirty: getFormIsDirty() })), (resolverRef.current ? {} : { isValid: getIsValid() })));
        if (!options.keepIsValid) {
            updateIsValid();
        }
    };
    const registerFieldRef = (name, ref, options) => {
        let field = get(fieldsRef.current, name);
        if (field) {
            const isRadioOrCheckbox = isRadioOrCheckboxFunction(ref);
            if ((isRadioOrCheckbox
                ? Array.isArray(field._f.refs) &&
                    compact(field._f.refs).find((option) => ref.value === option.value && option === ref)
                : ref === field._f.ref) ||
                !field ||
                (isWeb && isHTMLElement(field._f.ref) && !isHTMLElement(ref))) {
                return;
            }
            field = {
                _f: isRadioOrCheckbox
                    ? Object.assign(Object.assign({}, field._f), { refs: [
                            ...compact(field._f.refs || []).filter((ref) => isHTMLElement(ref) && document.contains(ref)),
                            ref,
                        ], ref: { type: ref.type, name } }) : Object.assign(Object.assign({}, field._f), { ref }),
            };
            set(fieldsRef.current, name, field);
            const defaultValue = updateValueAndGetDefault(name);
            if (isRadioOrCheckbox && Array.isArray(defaultValue)
                ? !deepEqual(get(fieldsRef.current, name)._f.value, defaultValue)
                : isUndefined(get(fieldsRef.current, name)._f.value)) {
                get(fieldsRef.current, name)._f.value = getFieldValue(get(fieldsRef.current, name));
            }
            if (options) {
                if (!validationMode.isOnSubmit &&
                    field &&
                    readFormStateRef.current.isValid) {
                    validateField(field, isValidateAllFieldCriteria).then((error) => {
                        isEmptyObject(error)
                            ? set(validFieldsRef.current, name, true)
                            : unset(validFieldsRef.current, name);
                        formStateRef.current.isValid &&
                            !isEmptyObject(error) &&
                            setFormState(Object.assign(Object.assign({}, formStateRef.current), { isValid: getIsValid() }));
                    });
                }
            }
        }
    };
    const register = react.useCallback((name, options) => {
        const isInitialRegister = !get(fieldsRef.current, name);
        set(fieldsRef.current, name, {
            _f: Object.assign(Object.assign(Object.assign({}, (isInitialRegister
                ? { ref: { name } }
                : Object.assign({ ref: (get(fieldsRef.current, name)._f || {}).ref }, get(fieldsRef.current, name)._f))), { name }), options),
        });
        options && set(fieldsWithValidationRef.current, name, true);
        fieldsNamesRef.current.add(name);
        isInitialRegister && updateValueAndGetDefault(name);
        return isWindowUndefined
            ? { name: name }
            : {
                name,
                onChange: handleChange,
                onBlur: handleChange,
                ref: (ref) => ref && registerFieldRef(name, ref, options),
            };
    }, [defaultValuesRef.current]);
    const handleSubmit = react.useCallback((onValid, onInvalid) => async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
            e.persist();
        }
        let fieldValues = Object.assign(Object.assign({}, defaultValuesRef.current), getFieldsValues(fieldsRef, defaultValuesRef));
        formStateSubjectRef.current.next({
            isSubmitting: true,
        });
        try {
            if (resolverRef.current) {
                const { errors, values } = await resolverRef.current(fieldValues, contextRef.current, {
                    criteriaMode,
                    fields: getFields(fieldsNamesRef.current, fieldsRef.current),
                });
                formStateRef.current.errors = errors;
                fieldValues = values;
            }
            else {
                await validateForm(fieldsRef.current);
            }
            if (isEmptyObject(formStateRef.current.errors) &&
                Object.keys(formStateRef.current.errors).every((name) => get(fieldValues, name))) {
                formStateSubjectRef.current.next({
                    errors: {},
                    isSubmitting: true,
                });
                await onValid(fieldValues, e);
            }
            else {
                onInvalid && (await onInvalid(formStateRef.current.errors, e));
                shouldFocusError &&
                    focusFieldBy(fieldsRef.current, (key) => get(formStateRef.current.errors, key), fieldsNamesRef.current);
            }
        }
        finally {
            formStateRef.current.isSubmitted = true;
            formStateSubjectRef.current.next({
                isSubmitted: true,
                isSubmitting: false,
                isSubmitSuccessful: isEmptyObject(formStateRef.current.errors),
                submitCount: formStateRef.current.submitCount + 1,
                errors: formStateRef.current.errors,
            });
        }
    }, [shouldFocusError, isValidateAllFieldCriteria, criteriaMode]);
    const resetFromState = react.useCallback(({ keepErrors, keepDirty, keepIsSubmitted, keepTouched, keepIsValid, keepSubmitCount, }) => {
        if (!keepIsValid) {
            validFieldsRef.current = {};
            fieldsWithValidationRef.current = {};
        }
        watchFieldsRef.current = new Set();
        isWatchAllRef.current = false;
        formStateSubjectRef.current.next({
            submitCount: keepSubmitCount ? formStateRef.current.submitCount : 0,
            isDirty: keepDirty ? formStateRef.current.isDirty : false,
            isSubmitted: keepIsSubmitted ? formStateRef.current.isSubmitted : false,
            isValid: keepIsValid
                ? formStateRef.current.isValid
                : !validationMode.isOnSubmit,
            dirtyFields: keepDirty ? formStateRef.current.dirtyFields : {},
            touchedFields: keepTouched ? formStateRef.current.touchedFields : {},
            errors: keepErrors ? formStateRef.current.errors : {},
            isSubmitting: false,
            isSubmitSuccessful: false,
        });
    }, []);
    const reset = (values, keepStateOptions = {}) => {
        const updatedValues = values || defaultValuesRef.current;
        if (isWeb && !keepStateOptions.keepValues) {
            for (const field of Object.values(fieldsRef.current)) {
                if (field && field._f) {
                    const inputRef = Array.isArray(field._f.refs)
                        ? field._f.refs[0]
                        : field._f.ref;
                    if (isHTMLElement(inputRef)) {
                        try {
                            inputRef.closest('form').reset();
                            break;
                        }
                        catch (_a) { }
                    }
                }
            }
        }
        !keepStateOptions.keepDefaultValues &&
            (defaultValuesRef.current = Object.assign({}, updatedValues));
        if (!keepStateOptions.keepValues) {
            fieldsRef.current = {};
            controllerSubjectRef.current.next({
                values: Object.assign({}, updatedValues),
            });
            watchSubjectRef.current.next({
                value: Object.assign({}, updatedValues),
            });
            fieldArraySubjectRef.current.next({
                fields: Object.assign({}, updatedValues),
                isReset: true,
            });
        }
        resetFromState(keepStateOptions);
    };
    react.useEffect(() => {
        isMountedRef.current = true;
        const formStateSubscription = formStateSubjectRef.current.subscribe({
            next(formState = {}) {
                if (shouldRenderFormState(formState, readFormStateRef.current, true)) {
                    formStateRef.current = Object.assign(Object.assign({}, formStateRef.current), formState);
                    setFormState(formStateRef.current);
                }
            },
        });
        const useFieldArraySubscription = fieldArraySubjectRef.current.subscribe({
            next(state) {
                if (state.fields && state.name && readFormStateRef.current.isValid) {
                    const values = getFieldsValues(fieldsRef);
                    set(values, state.name, state.fields);
                    updateIsValid(values);
                }
            },
        });
        resolverRef.current && readFormStateRef.current.isValid && updateIsValid();
        return () => {
            watchSubjectRef.current.unsubscribe();
            formStateSubscription.unsubscribe();
            useFieldArraySubscription.unsubscribe();
        };
    }, []);
    return {
        control: react.useMemo(() => ({
            register,
            isWatchAllRef,
            watchFieldsRef,
            getFormIsDirty,
            formStateSubjectRef,
            fieldArraySubjectRef,
            controllerSubjectRef,
            watchSubjectRef,
            watchInternal,
            fieldsRef,
            validFieldsRef,
            fieldsWithValidationRef,
            fieldArrayNamesRef,
            readFormStateRef,
            formStateRef,
            defaultValuesRef,
            fieldArrayDefaultValuesRef,
        }), []),
        formState: getProxyFormState(isProxyEnabled, formState, readFormStateRef),
        trigger,
        register,
        handleSubmit,
        watch: react.useCallback(watch, []),
        setValue: react.useCallback(setValue, [setInternalValues]),
        getValues: react.useCallback(getValues, []),
        reset: react.useCallback(reset, []),
        clearErrors: react.useCallback(clearErrors, []),
        unregister: react.useCallback(unregister, []),
        setError: react.useCallback(setError, []),
    };
}

export { FormProvider, useForm, useFormContext };
