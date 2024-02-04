let data;
let tabId;

async function download() {
    json = JSON.stringify(data, null, 4);
    var blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cookie-report-${tabId}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

async function initialize() {
    const urlParams = new URLSearchParams(window.location.search);
    tabId = urlParams.get("tabId");
    data = await chrome.runtime.sendMessage({ getCookiesForTabId: tabId });

    const text = document.getElementById("text");
    text.innerText = JSON.stringify(data, null, 2);

    const table = document.getElementById("table");
    const dialog = document.getElementById("dialog");
    const recJson = document.getElementById("recJson");
    for (let record of data) {
        let temp = document.getElementById("row-template");
        let clon = temp.content.cloneNode(true);
        clon.getElementById("name").innerText = record.cookie?.name || "";
        clon.getElementById("value").innerText = record.cookie?.value || "";
        clon.getElementById("path").innerText = record.cookie?.path || "";
        clon.getElementById("domain").innerText = record.cookie?.domain || "";
        clon.getElementById("source").innerText = record.source;
        clon.getElementById("record").addEventListener("click", function () {
            recJson.innerText = JSON.stringify(record, null, 4);
            dialog.showModal();
        });
        table.appendChild(clon);
    }

    table.style.display = "block";

    document.getElementById("download").addEventListener("click", download);
}

initialize();
