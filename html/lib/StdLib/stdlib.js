var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _IdDictionary_item2id, _IdDictionary_id2item, _Assertion_assertion;
export function Arraying(e) {
    const concat = function (arr) {
        let res = [];
        for (const e of arr) {
            res = res.concat(Arraying(e));
        }
        return res;
    };
    return e instanceof Array ? concat(e) : [e];
}
// 引数には any が入る.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasSameValue = (o1, o2) => {
    if (o1 === o2) {
        return true;
    } // same object
    if (o1 == null) {
        return false;
    } // because the other is not null
    if (o2 == null) {
        return false;
    } // because the other is not null
    if (Object.keys(o1).length != Object.keys(o2).length) {
        return false;
    }
    for (const key in o1) {
        if (!(key in o2)) {
            return false;
        }
        if (typeof o1[key] === "object") {
            if (!hasSameValue(o1[key], o2[key])) {
                return false;
            } // deep check
        }
        else if (o1[key] != o2[key]) {
            return false;
        }
    }
    return true;
};
export class IdDictionary {
    constructor() {
        _IdDictionary_item2id.set(this, {}); // eslint-disable-line @typescript-eslint/no-explicit-any
        _IdDictionary_id2item.set(this, []);
    }
    get length() {
        return __classPrivateFieldGet(this, _IdDictionary_id2item, "f").length;
    }
    register(item) {
        const id = __classPrivateFieldGet(this, _IdDictionary_item2id, "f")[item];
        if (id !== undefined) {
            return id;
        }
        else {
            const i = __classPrivateFieldGet(this, _IdDictionary_id2item, "f").length;
            __classPrivateFieldGet(this, _IdDictionary_item2id, "f")[item] = i;
            __classPrivateFieldGet(this, _IdDictionary_id2item, "f")[i] = item;
            return i;
        }
    }
    getId(item) {
        const id = __classPrivateFieldGet(this, _IdDictionary_item2id, "f")[item];
        if (id === undefined) {
            throw new ReferenceError(`key ${String(item)} not found`);
        }
        return id;
    }
    getItem(id) {
        const item = __classPrivateFieldGet(this, _IdDictionary_id2item, "f")[id];
        if (item === undefined) {
            throw new ReferenceError(`id ${String(id)} not found`);
        }
        return item;
    }
    showAll() {
        return __classPrivateFieldGet(this, _IdDictionary_id2item, "f");
    }
}
_IdDictionary_item2id = new WeakMap(), _IdDictionary_id2item = new WeakMap();
// エラーを期待するテストのための, 予想外のエラーを受け取った時のエラー
export class UnexpectedErrorThrownError extends Error {
    constructor(message) {
        super(message);
    }
}
export class NotImplementedError extends Error {
    constructor(message) {
        super(message);
    }
}
export class Assertion {
    constructor(assertion) {
        _Assertion_assertion.set(this, void 0);
        __classPrivateFieldSet(this, _Assertion_assertion, assertion, "f");
    }
    onFailed(errorExcecution) {
        if (!__classPrivateFieldGet(this, _Assertion_assertion, "f")) {
            errorExcecution();
        }
    }
}
_Assertion_assertion = new WeakMap();
export const assertNotNull = (value) => {
    if (value === null) {
        throw new TypeError("null value received");
    }
    return value;
};
export const assertNotUndefined = (value) => {
    if (value === undefined) {
        throw new TypeError("undefined value received");
    }
    return value;
};
export const assertNonNullable = (value) => {
    return assertNotNull(assertNotUndefined(value));
};
export const assertNotNaN = (value) => {
    if (isNaN(value)) {
        throw new TypeError("NaN value received");
    }
    return value;
};
export const castToNumber = (value) => {
    return assertNotNaN(Number(value));
};
