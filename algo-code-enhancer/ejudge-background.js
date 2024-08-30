let ALGO_CODE_FRAGMENTS = {};
let ALGO_CODE_INPUT = {};
let ALGO_CODE_SEND_BUTTON = {};


(function () {
    // стили для кнопок

    let button_style = `
    <style>
        .copy-code-button {
            cursor: pointer;
            width: auto;
            height: auto;
            padding: 10px 15px;
            background-color: transparent;
            border-width: 2px;
            border-radius: 5px;
            font-size: 1.2em;
            margin-bottom: 5px;
            box-shadow: 1px 1px;
            transition: all 0.1s ease-out;
        }

        .copy-code-button:active {
            box-shadow: none;
            transform: translate(1px, 1px);
        }
        
        .copy-code-button:hover {
            background-color: rgba(0.5, 0.5, 0.5, 0.02);
        }
    </style>`;
    document.head.insertAdjacentHTML("beforeend", button_style);

    // находим все куски кода
    ALGO_CODE_FRAGMENTS = document.getElementsByTagName("pre");
    for (let i = 0; i < ALGO_CODE_FRAGMENTS.length; i++) {
        // к каждому куску кода приписываю кнопку
        const code = `<button class="copy-code-button" type = "button"
                              onclick="AlgoCopyClicked(${i});">Скопировать</button>`;
        ALGO_CODE_FRAGMENTS[i].insertAdjacentHTML("beforebegin", code);
    }

    // получаю окно для ввода кода и кнопку
    ALGO_CODE_INPUT = document.getElementsByName("text_form")[0];
    ALGO_CODE_SEND_BUTTON = document.getElementsByName("action_40")[0];
    if (ALGO_CODE_INPUT !== undefined && ALGO_CODE_SEND_BUTTON !== undefined) {
        const code = `<button class="copy-code-button" type="button" 
                                       onclick="AlgoSendClicked();">Вставить из буфера и отправить</button>`;
        ALGO_CODE_INPUT.parentElement.parentElement.insertAdjacentHTML("beforebegin", code);
    }
})();

function AlgoCopyClicked(elem) {
    navigator.clipboard.writeText(ALGO_CODE_FRAGMENTS[elem].innerText);
}

function AlgoSendClicked() {
    navigator.clipboard.readText().then(text => {
        ALGO_CODE_INPUT.value = text;
        ALGO_CODE_SEND_BUTTON.click();
    });
}

