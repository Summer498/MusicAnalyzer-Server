import { Time } from "./time";

export const compress = <T>(arr: T[]) => {
  const ret: { time: Time, item: T }[] = [];
  let begin = 0;
  let item = arr[0];
  arr.forEach((e, end) => {
    if (item !== e) {
      ret.push({ time: new Time(begin, end), item });
      begin = end;
      item = e;
    }
  });
  ret.push({ time: new Time(begin, arr.length), item: item });
  return ret;
};
