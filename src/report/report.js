let data;

async function initialize() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabId = urlParams.get("tabId");
    data = await chrome.runtime.sendMessage({ getCookiesForTabId: tabId });

    const text = document.getElementById("text");
    text.innerText = JSON.stringify(data, null, 2);

    const table = document.getElementById("table");
    const dialog = document.getElementById("dialog");
    const recjson = document.getElementById("recjson");
    for (let record of data) {
        let temp = document.getElementById("row-template");
        let clon = temp.content.cloneNode(true);
        clon.getElementById("name").innerText = record.cookie?.name || "";
        clon.getElementById("value").innerText = record.cookie?.value || "";
        clon.getElementById("path").innerText = record.cookie?.path || "";
        clon.getElementById("domain").innerText = record.cookie?.domain || "";
        clon.getElementById("source").innerText = record.source;
        clon.getElementById("record").addEventListener("click", function () {
            recjson.innerText = JSON.stringify(record, null, 4);
            dialog.showModal();
        });
        table.appendChild(clon);
    }

    table.style.display = "block";
}

initialize();
