const DEFAULT_REFRESH = false;
const DEFAULT_REFRESH_TIME = 200;


function getOrDefault(key, defaultValue, sendResponse) {
    chrome.storage.local.get({[key]: defaultValue}).then(sendResponse);
}

async function set(key, value) {
    await chrome.storage.local.set({[key]: value});
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch (request.action) {
            case "get_refresh":
                getOrDefault("refresh", DEFAULT_REFRESH, sendResponse);
                return true;

            case "set_refresh":
                set("refresh", request.refresh);
                return true;

            case "get_refresh_time":
                getOrDefault("refresh_time", DEFAULT_REFRESH_TIME, sendResponse);
                return true;

            case "set_refresh_time":
                set("refresh_time", request.refresh_time);
                return true;

            case "reload":
                try {
                    chrome.tabs.reload(sender.tab.id);
                    return true;
                } catch (e) {
                    return false;
                }

            default:
                throw new Error(`Unknown action: ${request}`);
        }
    },
);
