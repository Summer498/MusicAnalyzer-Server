export declare type recurrentArray<T> = T | recurrentArray<T>[];
export declare function Arraying<T>(e: recurrentArray<T>): T[];
export declare const hasSameValue: (o1: any, o2: any) => boolean;
export declare class IdDictionary<Key extends keyof any> {
    #private;
    constructor();
    get length(): number;
    register(item: Key): number;
    getId(item: Key): {
        [key: string]: number;
        [key: number]: number;
        [key: symbol]: number;
    }[Key];
    getItem(id: number): Key;
    showAll(): Key[];
}
export declare class UnexpectedErrorThrownError extends Error {
    constructor(message?: string | undefined);
}
export declare class NotImplementedError extends Error {
    constructor(message?: string | undefined);
}
export declare class Assertion {
    #private;
    constructor(assertion: boolean);
    onFailed(errorExcecution: () => void): void;
}
export declare const assertNotNull: <T>(value: T | null) => T;
export declare const assertNotUndefined: <T>(value: T | undefined) => T;
export declare const assertNonNullable: <T>(value: T | null | undefined) => T;
export declare const assertNotNaN: (value: number) => number;
export declare const castToNumber: (value: string) => number;
