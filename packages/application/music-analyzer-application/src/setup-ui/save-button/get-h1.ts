export const getH1 = (title: HTMLHeadElement) => {
  const h1 = document.createElement("h1");
  h1.textContent = title.textContent;
  return h1;
};