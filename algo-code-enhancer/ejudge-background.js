{
    // перезагружаем страницу, если надо

    const submit_tab = document.getElementById("ej-main-submit-tab");
    if (submit_tab.children.length >= 4) {

        const submission_rows = submit_tab.children[3].tBodies[0].rows;
        if (submission_rows.length > 1) {

            const result = submission_rows[1].cells[5].textContent;
            if (result === "Компилируется..." || result === "Выполняется...") {

                chrome.runtime
                    .sendMessage({action: "get_refresh"})
                    .then(response => {
                        if (response.refresh) {
                            return chrome.runtime.sendMessage({action: "get_refresh_time"});
                        }
                    })
                    .then(response => {
                        return setTimeout(() => {
                            chrome.runtime.sendMessage({action: "reload"});
                        }, response.refresh_time);
                    });
            }
        }
    }
}

// находим все куски кода
let codeFragments = document.getElementsByTagName("pre");
for (let i = 0; i < codeFragments.length; i++) {
    // к каждому куску кода приписываю кнопку
    const button = document.createElement("button");
    button.classList.add("big-chungus-button");
    button.type = "button";
    button.onclick = () => copyCodeFragment(i);
    button.textContent = "Скопировать";
    codeFragments[i].insertAdjacentElement("beforebegin", button);
}

// получаю окно для ввода кода и кнопку отправки
let submissionInput = document.getElementsByName("text_form")[0];
let submitButton = document.getElementsByName("action_40")[0];
if (submissionInput !== undefined && submitButton !== undefined) {
    const button = document.createElement("button");
    button.classList.add("big-chungus-button");
    button.type = "button";
    button.onclick = submitSolution;
    button.textContent = "Вставить из буфера и отправить";

    submissionInput.parentElement.parentElement.insertAdjacentElement("beforebegin", button);
}


function copyCodeFragment(elem) {
    navigator.clipboard.writeText(codeFragments[elem].innerText);
}

function submitSolution() {
    navigator.clipboard.readText().then(text => {
        submissionInput.value = text;
        submitButton.click();
    });
}
