"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _IdDictionary_item2id, _IdDictionary_id2item, _Assertion_assertion;
Object.defineProperty(exports, "__esModule", { value: true });
exports.castToNumber = exports.assertNotNaN = exports.assertNonNullable = exports.assertNotUndefined = exports.assertNotNull = exports.Assertion = exports.NotImplementedError = exports.UnexpectedErrorThrownError = exports.IdDictionary = exports.hasSameValue = exports.Arraying = void 0;
function Arraying(e) {
    const concat = function (arr) {
        let res = [];
        for (const e of arr) {
            res = res.concat(Arraying(e));
        }
        return res;
    };
    return e instanceof Array ? concat(e) : [e];
}
exports.Arraying = Arraying;
// 引数には any が入る.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasSameValue = (o1, o2) => {
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
            if (!(0, exports.hasSameValue)(o1[key], o2[key])) {
                return false;
            } // deep check
        }
        else if (o1[key] != o2[key]) {
            return false;
        }
    }
    return true;
};
exports.hasSameValue = hasSameValue;
class IdDictionary {
    constructor() {
        _IdDictionary_item2id.set(this, void 0); // eslint-disable-line @typescript-eslint/no-explicit-any
        _IdDictionary_id2item.set(this, void 0);
        __classPrivateFieldSet(this, _IdDictionary_item2id, {}, "f");
        __classPrivateFieldSet(this, _IdDictionary_id2item, [], "f");
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
exports.IdDictionary = IdDictionary;
_IdDictionary_item2id = new WeakMap(), _IdDictionary_id2item = new WeakMap();
// エラーを期待するテストのための, 予想外のエラーを受け取った時のエラー
class UnexpectedErrorThrownError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.UnexpectedErrorThrownError = UnexpectedErrorThrownError;
class NotImplementedError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.NotImplementedError = NotImplementedError;
class Assertion {
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
exports.Assertion = Assertion;
_Assertion_assertion = new WeakMap();
const assertNotNull = (value) => {
    if (value === null) {
        throw new TypeError("null value received");
    }
    return value;
};
exports.assertNotNull = assertNotNull;
const assertNotUndefined = (value) => {
    if (value === undefined) {
        throw new TypeError("undefined value received");
    }
    return value;
};
exports.assertNotUndefined = assertNotUndefined;
const assertNonNullable = (value) => {
    return (0, exports.assertNotNull)((0, exports.assertNotUndefined)(value));
};
exports.assertNonNullable = assertNonNullable;
const assertNotNaN = (value) => {
    if (isNaN(value)) {
        throw new TypeError("NaN value received");
    }
    return value;
};
exports.assertNotNaN = assertNotNaN;
const castToNumber = (value) => {
    return (0, exports.assertNotNaN)(Number(value));
};
exports.castToNumber = castToNumber;
//# sourceMappingURL=stdlib.js.map