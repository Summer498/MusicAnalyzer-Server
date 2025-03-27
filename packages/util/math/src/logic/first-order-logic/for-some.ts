export const forSome = <T>(set: T[], condition: (element: T) => boolean) => {
  for (const e of set) {
    if (condition(e)) { return true; }
  }
  return false;
};