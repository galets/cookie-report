let tabId;

async function download() {
    const data = await chrome.runtime.sendMessage({ getCookiesForTabId: tabId });

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

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    tabId = tabs[0].id;
    const view = document.getElementById("view");
    view.addEventListener("click", function () {
        chrome.tabs.create({ url: `/report/report.html?tabId=${tabId}` });
    });

    document.getElementById("download").addEventListener("click", download);
});
