async function onMessage(msg) {
    if (msg.data?.cookieSetIntercepted) {
        for (let it = 5; !chrome.runtime?.id && it; --it) {
            await new Promise((resolve) => window.setTimeout(resolve, 1000));
        }
        try {
            await chrome.runtime.sendMessage(msg.data);
        } catch (e) {
            // ignore
        }
    }
}

window.addEventListener("message", onMessage, false);
