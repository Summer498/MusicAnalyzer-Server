export const forAll = <T>(set: T[], condition: (element: T) => boolean) => {
  for (const e of set) {
    if (condition(e) == false) { return false; }
  }
  return true;
};