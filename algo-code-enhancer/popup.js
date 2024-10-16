const refresh_checkbox = document.getElementById("refresh");
const refresh_time_input = document.getElementById("refresh_time");
const names_input = document.getElementById("names");
const friends_input = document.getElementById("friends");

chrome.runtime
    .sendMessage({action: "get"})
    .then(response => {
            refresh_checkbox.checked = response.refresh;
            refresh_time_input.value = response.refresh_time;
            names_input.value = response.names;
            friends_input.value = response.friends;
        },
    );

refresh_checkbox.onchange = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {refresh: refresh_checkbox.checked},
});

refresh_time_input.onchange = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {refresh_time: refresh_time_input.value},
});

names_input.onchange = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {names: names_input.value},
});

friends_input.onchange = () => chrome.runtime.sendMessage({
    action: "set",
    data:   {friends: friends_input.value},
});
