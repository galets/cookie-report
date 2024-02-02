import { parseString, splitCookiesString } from "./set-cookie.js";

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data?.cookieSetIntercepted) {
        const parsed = parseString(data.cookieSetIntercepted.cookie);
        console.log(`Cookie was set on ${sender?.tab?.id}`, parsed, data.cookieSetIntercepted);
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
            try {
                const cookies = splitCookiesString(headerSetCookie);
                for (let cookie of cookies) {
                    const parsed = parseString(cookie);
                    console.log(`Cookie was set via header on ${details.tabId}`, parsed);
                }
            } catch (e) {
                console.log(`Malformed cookie was set via header on ${details.tabId}`, headerSetCookie, details);
            }
        }
    },
    { urls: ["http://*/*", "https://*/*"] },
    ["responseHeaders", "extraHeaders"]
);
