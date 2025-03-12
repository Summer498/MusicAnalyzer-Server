export const remove_item = <T>(array: T[], will_removed: (item: T) => boolean) => {
  const ret: T[] = [];
  for (const e of array) {
    if (will_removed(e)) { continue; }
    ret.push(e);
  }
  return ret;
};
