chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const view = document.getElementById("view");
    view.href = "#";
    view.addEventListener("click", function () {
        chrome.tabs.create({ url: `/report/report.html?tabId=${tabs[0].id}` });
    });
});
