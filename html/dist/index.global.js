"use strict";
(() => {
  // index.ts
  var server_max_file_size_mega = 64;
  var file_size_is_too_large_area = document.getElementsByName("fileSizeIsTooLarge")[0];
  var getFileSizeStr = (file_size) => {
    const kilo = file_size / 1024;
    const mega = kilo / 1024;
    const giga = mega / 1024;
    if (file_size < 1024) {
      return `${file_size}B`;
    } else if (kilo < 1024) {
      return `${kilo}KB`;
    } else if (mega < 1024) {
      return `${mega}MB`;
    } else {
      return `${giga}GB`;
    }
  };
  var printFileSizeIsTooLarge = (file_size) => {
    const old_messages = file_size_is_too_large_area.children;
    const message = old_messages.length > 0 ? old_messages[0] : document.createElement("p");
    message.textContent = `\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA${getFileSizeStr(
      file_size
    )}\u306F\u5927\u304D\u3059\u304E\u307E\u3059. \u6700\u5927\u30B5\u30A4\u30BA\u306F${server_max_file_size_mega} MB\u3067\u3059`;
    file_size_is_too_large_area.insertAdjacentElement("afterbegin", message);
  };
  var printFileSize = (e) => {
    const target = e.target;
    if (target && target.files && target.files?.length !== 0) {
      const size = target.files[0].size;
      console.log(size);
      if (size >= server_max_file_size_mega * 1024 * 1024) {
        printFileSizeIsTooLarge(size);
      }
    }
  };
  window.addEventListener("DOMContentLoaded", function() {
    this.document.getElementById("upload_file")?.addEventListener("change", printFileSize);
  });
})();
