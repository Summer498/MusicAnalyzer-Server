const server_max_file_size_mega = 64;
const file_size_is_too_large_area =
  this.document.getElementsByName("fileSizeIsTooLarge")[0];

const getFileSizeStr = (file_size: number) => {
  const kilo = file_size / 1024;
  const mega = kilo / 1024;
  const giga = mega / 1024;

  if (file_size < 1024) { return `${file_size}B`; }
  else if (kilo < 1024) { return `${kilo}KB`; }
  else if (mega < 1024) { return `${mega}MB`; }
  else { return `${giga}GB`; }

};
const printFileSizeIsTooLarge = (file_size: number) => {
  const old_messages = file_size_is_too_large_area.children;
  const message = old_messages.length > 0 ? old_messages[0] : document.createElement("p");
  message.textContent = `ファイルサイズ${getFileSizeStr(
    file_size
  )}は大きすぎます. 最大サイズは${server_max_file_size_mega} MBです`;
  file_size_is_too_large_area.insertAdjacentElement("afterbegin", message);
};
const printFileSize = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target && target.files && target.files?.length !== 0) {
    const size = target.files[0].size;
    console.log(size);
    if (size >= server_max_file_size_mega * 1024 * 1024) {
      printFileSizeIsTooLarge(size);
    }
  }
};

window.addEventListener("DOMContentLoaded", function () {
  this.document
    .getElementById("upload_file")
    ?.addEventListener("change", printFileSize);
});
