export const splitArray = <T>(arr: T[], separator: (e: T) => boolean) => {
  const res: T[][] = [];
  let elm: T[] = [];
  arr.forEach(e => {
    if (separator(e)) {
      res.push(elm.map(e => e));
      elm = [];
    } else { elm.push(e); }
  });
  res.push(elm.map(e => e));
  return res;
};
