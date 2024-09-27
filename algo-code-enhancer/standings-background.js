/** @type {HTMLTableElement} */
let ALGO_STANDINGS_FIXED = null, ALGO_STANDINGS = null;

(async function () {
    // ждем пока таблица загрузится
    while (true) {
        ALGO_STANDINGS_FIXED = document.getElementById("standings_fixed");
        ALGO_STANDINGS = document.getElementById("standings");

        if (ALGO_STANDINGS === null ||
            ALGO_STANDINGS.children.length === 0 ||
            ALGO_STANDINGS_FIXED === null ||
            ALGO_STANDINGS_FIXED.children.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 200));
        } else {
            break;
        }
    }

    const num_of_info_rows = ALGO_STANDINGS_FIXED.tBodies[0].rows[0].cells.length - 1;

    { // добавляем новый ряд с количеством сданных задач и настраиваем таблицу для боковой панели
        const table_body = ALGO_STANDINGS_FIXED.tBodies[0];

        const head_row = table_body.rows[0];
        const space_row = table_body.rows[1];

        space_row.insertAdjacentElement("afterend", space_row.cloneNode(true));

        for (let i = 0; i < num_of_info_rows; i++) {
            head_row.cells[i].rowSpan = 3;
        }
    }

    { // добавляем новый ряд с количеством сданных задач и настраиваем таблицу для основной части
        const table_body = ALGO_STANDINGS.tBodies[0];

        const head_row = table_body.rows[0];
        const task_row = table_body.rows[1];
        task_row.insertAdjacentElement("afterend", task_row.cloneNode(true));

        for (let i = 0; i < num_of_info_rows; i++) {
            head_row.cells[i].rowSpan = 3;
        }

        const count_row = table_body.rows[2];
        const num_of_tasks = count_row.cells.length - 1;
        // подсчитаем количество успешных решений
        const counter = Array(num_of_tasks).fill(0);
        for (let row_i = 3; row_i < table_body.rows.length - 1; row_i++) {
            const row = table_body.rows[row_i];

            for (let column_i = 0; column_i < num_of_tasks; column_i++) {
                if (row.cells[column_i + num_of_info_rows].classList.contains("ok")) {
                    counter[column_i]++;
                }
            }
        }

        // и вводим данные в таблицу
        for (let column_i = 0; column_i < num_of_tasks; column_i++) {
            count_row.cells[column_i].textContent = counter[column_i];
            count_row.cells[column_i].style.color = "green";
            count_row.cells[column_i].style.fontWeight = "bold";
        }
    }

    { // получаем и настраиваем кнопку, добавляю реакцию на клик в конце, чтобы не нарушить работу моего кода
        const score_button = ALGO_STANDINGS_FIXED.tBodies[0].rows[0].cells[3];
        const penalty_button = ALGO_STANDINGS_FIXED.tBodies[0].rows[0].cells[4];

        const default_color = score_button.style.color;
        const default_weight = score_button.style.fontWeight;
        const new_color = "blue";
        const new_weight = "bold";

        function sort_by_score(a, b) {
            return (Number(b.cells[3].textContent) - Number(a.cells[3].textContent)) * 100000 +
                (Number(a.cells[4].textContent) - Number(b.cells[4].textContent));
        }

        function sort_by_penalty(a, b) {
            return (Number(b.cells[4].textContent) - Number(a.cells[4].textContent)) * 100000 +
                (Number(b.cells[3].textContent) - Number(a.cells[3].textContent));
        }

        function activate_penalty_button() {
            score_button.style.color = default_color;
            score_button.style.fontWeight = default_weight;
            penalty_button.style.color = new_color;
            penalty_button.style.fontWeight = new_weight;
        }

        function activate_score_button() {
            score_button.style.color = new_color;
            score_button.style.fontWeight = new_weight;
            penalty_button.style.color = default_color;
            penalty_button.style.fontWeight = default_weight;
        }

        activate_penalty_button();

        score_button.onclick = () => {
            AlgoPenaltySort(ALGO_STANDINGS_FIXED.tBodies[0], sort_by_score);
            AlgoPenaltySort(ALGO_STANDINGS.tBodies[0], sort_by_score);
            activate_penalty_button();
        };
        penalty_button.onclick = () => {
            AlgoPenaltySort(ALGO_STANDINGS_FIXED.tBodies[0], sort_by_penalty);
            AlgoPenaltySort(ALGO_STANDINGS.tBodies[0], sort_by_penalty);
            activate_score_button();
        };
    }
})();

/** @param {HTMLTableSectionElement} table_body
 * @param { (a: HTMLTableRowElement, b: HTMLTableRowElement) => number} compare_function */
function AlgoPenaltySort(table_body, compare_function) {
    // выбираем все строки с данными
    /** @type {HTMLTableRowElement[]} */
    const data_rows = [];
    for (let i = 3; i < table_body.rows.length; i++) {
        data_rows.push(table_body.rows[i]);
    }

    // удаляем их из таблицы
    for (const row of data_rows) {
        table_body.removeChild(row);
    }

    // сортируем данные
    data_rows.sort(compare_function);

    // добавляем их обратно в таблицу
    for (const row of data_rows) {
        table_body.appendChild(row);
    }
}
