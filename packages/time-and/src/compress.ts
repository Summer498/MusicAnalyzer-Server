export const compress = <T>(arr: T[]) => {
  const ret: { begin: number, end: number, item: T }[] = [];
  let begin = 0;
  let item = arr[0];
  arr.forEach((e, end) => {
    if (item !== e) {
      ret.push({ begin, end, item });
      begin = end;
      item = e;
    }
  });
  ret.push({ begin, end: arr.length, item: item });
  return ret;
};
