document.getElementsByName("insert-here").forEach(insert_here => {
    const insert_elm = document.createElement("p");
    insert_elm.textContent = "いえーい"
    insert_here.insertAdjacentElement("beforeend", insert_elm);
})

console.log("ろーどされたよぉ");