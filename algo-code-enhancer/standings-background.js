let ALGO_STANDINGS_FIXED = null;
let ALGO_STANDINGS = null;

(async function () {
    // ждем пока таблица загрузится
    while (ALGO_STANDINGS === null || ALGO_STANDINGS.children.length === 0 ||
    ALGO_STANDINGS_FIXED === null || ALGO_STANDINGS_FIXED.children.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        ALGO_STANDINGS_FIXED = document.getElementById("standings_fixed");
        ALGO_STANDINGS = document.getElementById("standings");
        console.log("aaa");
    }
    // получаем и настраиваем кнопку
    let penalty = ALGO_STANDINGS_FIXED.children[0].children[0].children[4];
    penalty.style.color = "blue";
    penalty.style.fontWeight = "bold";

    {
        // добавляем новый ряд с количеством сданных задач и настраиваем таблицу
        // для боковой панели
        let table_body = ALGO_STANDINGS_FIXED.children[0];
        /** @type {HTMLTableRowElement} */
        let head_row = table_body.children[0];
        let space_row = table_body.children[1];
        space_row.insertAdjacentElement("afterend", space_row.cloneNode(true));

        for (let i = 0; i < 5; i++) {
            head_row.children[i].rowSpan = 3;
        }
    }
    {
        // добавляем новый ряд с количеством сданных задач и настраиваем таблицу
        // для основной части
        let table_body = ALGO_STANDINGS.children[1];
        /** @type {HTMLTableRowElement} */
        let head_row = table_body.children[0];
        let task_row = table_body.children[1];
        task_row.insertAdjacentElement("afterend", task_row.cloneNode(true));

        for (let i = 0; i < 5; i++) {
            head_row.children[i].rowSpan = 3;
        }
        let count_row = table_body.children[2];
        let task_count = count_row.children.length - 1;
        // всё подсчитаем
        let counter = Array(task_count).fill(0);
        for (let ri = 3; ri < table_body.children.length - 1; ri++) {
            let row = table_body.children[ri];

            for (let ci = 0; ci < task_count; ci++) {
                if (row.children[ci + 5].classList.contains("ok")) {
                    counter[ci]++;
                }
            }
        }

        // и вводим данные в таблицу
        for (let ci = 0; ci < task_count; ci++) {
            count_row.children[ci].innerHTML = counter[ci];
            count_row.children[ci].style.color = "green";
            count_row.children[ci].style.fontWeight = "bold";
        }
    }

    // добавляю клик в конце, чтобы не нарушить работу моего кода
    penalty.onclick = () => {
        AlgoPenaltySort(ALGO_STANDINGS_FIXED.children[0]);
        AlgoPenaltySort(ALGO_STANDINGS.children[1]);
    };

})();


function AlgoPenaltySort(table_body) {
    // выбираем все строки с данными
    /** @type {HTMLTableRowElement[]} */
    let data_rows = [];
    for (let i = 3; i < table_body.children.length; i++) {
        data_rows.push(table_body.children[i]);
    }
    // удаляем их из таблицы
    for (let row of data_rows) {
        table_body.removeChild(row);
    }

    // сортируем данные
    data_rows.sort((a, b) =>
        -Number(a.children[4].innerHTML) + Number(b.children[4].innerHTML),
    );

    // добавляем их обратно в таблицу
    for (let row of data_rows) {
        table_body.appendChild(row);
    }
}