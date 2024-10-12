let refresh_checkbox = document.getElementById("refresh");
let refresh_time_input = document.getElementById("refresh_time");
let names_input = document.getElementById("names");

chrome.runtime.sendMessage({"action": "get_refresh"}).then(
    response => refresh_checkbox.checked = response.refresh,
);

chrome.runtime.sendMessage({"action": "get_refresh_time"}).then(
    response => refresh_time_input.value = response.refresh_time,
);

chrome.runtime.sendMessage({"action": "get_names"}).then(
    response => names_input.value = response.names,
);

refresh_checkbox.onchange = () => {
    chrome.runtime.sendMessage({
        "action":  "set_refresh",
        "refresh": refresh_checkbox.checked,
    });
};

refresh_time_input.onchange = () => {
    chrome.runtime.sendMessage({
        "action":  "set_refresh_time",
        "refresh_time": refresh_time_input.value,
    });
}

names_input.onchange = () => {
    chrome.runtime.sendMessage({
        "action":  "set_names",
        "names": names_input.value,
    });
}
