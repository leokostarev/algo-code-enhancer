let ALGO_CODE_FRAGMENTS = {};
let ALGO_CODE_INPUT = {};
let ALGO_CODE_SEND_BUTTON = {};

function AlgoCode_injection() {
    // стиль для кнопки
    let button_style = `style="width: 150px;
    height: 40px;
    background-color: transparent;
    border-width: 1px;
    border-radius: 5px;
    font-size: 18px;
    margin-bottom: 5px;"`;
    let button_style2 = `style="width: 400px;
    height: 40px;
    background-color: transparent;
    border-width: 1px;
    border-radius: 5px;
    font-size: 18px;
    margin-top: 5px;
    margin-bottom: 5px;"`;

    // все куски кода
    ALGO_CODE_FRAGMENTS = document.getElementsByTagName("pre");
    for (let i = 0; i < ALGO_CODE_FRAGMENTS.length; i++) {
        // к каждому куску кода приписываю кнопку
        ALGO_CODE_FRAGMENTS[i].insertAdjacentHTML(
            "beforebegin",
            `<button ${button_style} onclick="AlgoCopyClicked(${i}, this);">Скопировать</button>`
        );
    }

    // получаю окно для ввода кода и кнопку
    ALGO_CODE_INPUT = document.getElementsByName("text_form")[0];
    ALGO_CODE_SEND_BUTTON = document.getElementsByName("action_40")[0];
    if (ALGO_CODE_INPUT !== undefined && ALGO_CODE_SEND_BUTTON !== undefined) {
        ALGO_CODE_INPUT.parentElement.parentElement.insertAdjacentHTML("beforebegin",
            `<button ${button_style2} type="button" onclick="AlgoSendClicked();">Вставить из буфера и отправить</button>`
        );
    }
}

function AlgoCopyClicked(elem, obj) {
    navigator.clipboard.writeText(ALGO_CODE_FRAGMENTS[elem].innerText);
    obj.innerText = "Скопирован!";
    obj.style.backgroundColor = "black";
    obj.style.color = "white";
    setTimeout(() => {
        obj.innerText = "Скопировать";
        obj.style.backgroundColor = "transparent";
        obj.style.color = "black";
    }, 1000);
}

function AlgoSendClicked() {
    navigator.clipboard.readText().then(text => {
        ALGO_CODE_INPUT.value = text;
        ALGO_CODE_SEND_BUTTON.click();
    })
}

AlgoCode_injection();
