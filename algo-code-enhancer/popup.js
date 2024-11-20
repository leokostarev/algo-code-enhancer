const refreshCheckboxElement = document.getElementById("refresh");
const refreshTimeInputElement = document.getElementById("refresh_time");
const namesInputElement = document.getElementById("names");
const friendsInputElement = document.getElementById("friends");
const saveButtonElement = document.getElementById("save_button");

chrome.runtime
    .sendMessage({action: "get"})
    .then(response => {
        refreshCheckboxElement.checked = response.refresh;
        refreshTimeInputElement.value = response.refreshTime;
        namesInputElement.value = response.names;
        friendsInputElement.value = response.friends;
    });

refreshCheckboxElement.onchange = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {refresh: refreshCheckboxElement.checked},
});

refreshTimeInputElement.onchange = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {refreshTime: refreshTimeInputElement.value},
});

namesInputElement.onchange = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {names: namesInputElement.value},
});

friendsInputElement.onchange = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {friends: friendsInputElement.value},
});

saveButtonElement.onclick = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {
        refresh:     refreshCheckboxElement.checked,
        refreshTime: refreshTimeInputElement.value,
        names:       namesInputElement.value,
        friends:     friendsInputElement.value,
    },
});
