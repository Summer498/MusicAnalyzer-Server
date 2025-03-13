export const getBodyAndRoot = (chord_string: string) => {
  chord_string = chord_string.replace("minor/major", "XXXXXXXXXXX");
  let separator = "/";
  let before_separator = chord_string.indexOf(separator);
  if (before_separator < 0) {
    separator = " on ";
    before_separator = chord_string.indexOf(separator);
  }
  chord_string = chord_string.replace("XXXXXXXXXXX", "minor/major");

  const body_length = before_separator >= 0 ? before_separator : chord_string.length;
  const body = chord_string.slice(0, body_length);
  const root = chord_string.slice(body_length + separator.length);
  return { body, root };
};
