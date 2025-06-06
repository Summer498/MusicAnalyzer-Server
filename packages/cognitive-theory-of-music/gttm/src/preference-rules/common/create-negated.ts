// 各 boolean を返すメソッドの型を反転させるマッピング型
type Negated<T> = {
  [Key in keyof T]: T[Key] extends (...args: infer Arg) => boolean
  ? (...args: Arg) => boolean
  : T[Key];
};

const not = (proposition: boolean) => proposition === false;
const negate = <T>(value: T) => {
  return typeof value === "boolean" ? not(value) : value;
};
const negateResult = <T, _, A extends _[], R, F 
  extends (...args: A) => R>(
  func: F,
  target: T,
  args: A
) => {
  return negate(func.apply(target, args));
};

type Param<Function> = Function extends (...args: infer A) => infer R ? A : never;
type Ret<Function> = Function extends (...args: infer A) => infer R ? R : never;


const negation_handler = {
  get<Target extends object, Prop extends keyof Target, Receiver, N>(
    target: Target,
    prop: Prop,
    receiver: Receiver
  ) {
    const value = Reflect.get(target, prop, receiver) as Prop extends keyof Target ? Target[Prop] : N;
    if (typeof value === "function") {
      type A = Param<Target[Prop]>
      type R = Ret<Target[Prop]>;
      type F = (...args: A) => R
      const fn = value as F;
      return (...args: A) => negateResult<Target, unknown, A, R, F>(fn, target, args);
    }
    else {
      return negate(value);
    }
  }
};

function createNegated<T extends object>(target: T) {
  return new Proxy(target, negation_handler) as Negated<T>;
}

export interface Negatable<T extends object = any> {
  readonly not: Negated<T>;
  readonly does_not: Negated<T>;
}

export const withNegatable = <T extends object>(target: T): T & Negatable<T> => {
  return Object.defineProperties(target, {
    not: { get: () => createNegated(target) },
    does_not: { get: () => createNegated(target) },
  }) as T & Negatable<T>;
};
