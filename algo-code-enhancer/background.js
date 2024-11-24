const FIELDS = {
    refresh:     false,
    refreshTime: 200,
    names:       "",
    friends:     "",
    move:        "no",
};

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch (request.action) {
            case "get":
                chrome.storage.local.get(FIELDS).then(sendResponse);
                return true;

            case "set":
                chrome.storage.local.set(request.data);
                return true;

            case "reload":
                try {
                    chrome.tabs.reload(sender.tab.id);
                    return true;
                } catch {
                    return false;
                }

            default:
                throw new Error("Unknown action: " + request.action);
        }
    },
);
