import { parseString, splitCookiesString } from "./set-cookie.js";

const tabs = {};

function addEvent(tabId, event) {
    if (!tabs[tabId]) {
        tabs[tabId] = [];
    }

    tabs[tabId].push(event);
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data?.cookieSetIntercepted && sender?.tab?.id) {
        const parsed = parseString(data.cookieSetIntercepted.cookie, { decodeValues: false });
        //console.log(`Cookie was set on ${sender?.tab?.id}`, parsed, data.cookieSetIntercepted);
        addEvent(sender?.tab?.id, { cookie: parsed, source: "script", stack: data.cookieSetIntercepted.stack });
    }

    if (data?.getCookiesForTabId) {
        sendResponse(tabs[data.getCookiesForTabId]);
        return true;
    }

    return false;
});

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        const hh = new Headers();
        for (let h of details?.responseHeaders || []) {
            hh.append(h.name, h.value);
        }

        for (let headerSetCookie of hh.getSetCookie()) {
            const cookies = splitCookiesString(headerSetCookie);
            for (let cookie of cookies) {
                const parsed = parseString(cookie, { decodeValues: false });
                //console.log(`Cookie was set via header on ${details.tabId}`, parsed);
                addEvent(details.tabId, { cookie: parsed, source: "header", url: details.url });
            }
        }
    },
    { urls: ["http://*/*", "https://*/*"] },
    ["responseHeaders", "extraHeaders"]
);

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    tabs[tabId] = undefined;
});
