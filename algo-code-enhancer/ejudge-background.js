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

    const response = await chrome.runtime.sendMessage({action: "get"});
    if (!response.refresh) {
        return;
    }

    setTimeout(
        () => chrome.runtime.sendMessage({action: "reload"}),
        response.refreshTime,
    );
}

function addCopyButtons() {
    const codeFragments = document.getElementsByTagName("pre");

    for (let fragment of codeFragments) {
        // к каждому куску кода приписываю кнопку
        const button = document.createElement("button");
        button.classList.add("big-chungus-button");
        button.type = "button";
        button.onclick = () => navigator.clipboard.writeText(fragment.innerText);
        button.textContent = "Скопировать";

        fragment.insertAdjacentElement("beforebegin", button);
    }
}

function addSubmitButton() {
    const submissionInput = document.getElementsByName("text_form")[0];
    const submitButton = document.getElementsByName("action_40")[0];

    if (submissionInput === undefined || submitButton === undefined) {
        return;
    }

    const button = document.createElement("button");
    button.classList.add("big-chungus-button");
    button.type = "button";
    button.onclick = async () => {
        submissionInput.value = await navigator.clipboard.readText();
        submitButton.click();
    };
    button.textContent = "Вставить из буфера и отправить";

    submissionInput.parentElement.parentElement.insertAdjacentElement("beforebegin", button);
}

reloadIfNecessary();
addCopyButtons();
addSubmitButton();
