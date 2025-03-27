// 引数には any が入る.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasSameValue = (o1: any, o2: any) => {
  if (o1 === o2) { return true; } // same object
  if (o1 === null) { return false; } // because the other is not null
  if (o2 === null) { return false; } // because the other is not null
  if (Object.keys(o1).length != Object.keys(o2).length) { return false; }
  for (const key in o1) {
    if (!(key in o2)) { return false; }
    if (typeof o1[key] === "object") {
      if (!hasSameValue(o1[key], o2[key])) { return false; } // deep check
    } else if (o1[key] != o2[key]) { return false; }
  }
  return true;
};
