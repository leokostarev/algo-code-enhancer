// получаю окно для ввода кода и кнопку отправки
let submissionInput = document.getElementsByName("text_form")[0];
let submitButton = document.getElementsByName("action_40")[0];
// находим все куски кода
let codeFragments = document.getElementsByTagName("pre");

async function reloadIfNecessary() {
    const submit_tab = document.getElementById("ej-main-submit-tab");
    if (!submit_tab || submit_tab.children.length < 4) {
        return;
    }
    const submission_rows = submit_tab.children[3].tBodies[0].rows;
    if (submission_rows.length <= 1) {
        return;
    }
    const result = submission_rows[1].cells[5].textContent;
    if (result !== "Компилируется..." && result !== "Выполняется...") {
        return;
    }

    let do_reload = await chrome.runtime.sendMessage({action: "get_refresh"});
    if (!do_reload.refresh) {
        return;
    }
    let reload_timeout = await chrome.runtime.sendMessage({action: "get_refresh_time"});

    setTimeout(
        () => chrome.runtime.sendMessage({action: "reload"}),
        reload_timeout.refresh_time,
    );
}

function addCopyButtons() {
    for (let i = 0; i < codeFragments.length; i++) {
        // к каждому куску кода приписываю кнопку
        const button = document.createElement("button");
        button.classList.add("big-chungus-button");
        button.type = "button";
        button.onclick = () => copyCodeFragment(i);
        button.textContent = "Скопировать";
        codeFragments[i].insertAdjacentElement("beforebegin", button);
    }
}

function addSubmitButton() {
    if (submissionInput !== undefined && submitButton !== undefined) {
        const button = document.createElement("button");
        button.classList.add("big-chungus-button");
        button.type = "button";
        button.onclick = submitSolution;
        button.textContent = "Вставить из буфера и отправить";

        submissionInput.parentElement.parentElement.insertAdjacentElement("beforebegin", button);
    }
}

async function copyCodeFragment(elem) {
    await navigator.clipboard.writeText(codeFragments[elem].innerText);
}

function submitSolution() {
    navigator.clipboard.readText().then(text => {
        submissionInput.value = text;
        submitButton.click();
    });
}

reloadIfNecessary();
addCopyButtons();
addSubmitButton();
