async function waitForStandingsToLoad() {
    async function waitIfNotLoaded(el) {
        if (el === null || el.children.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return true;
        }
        return false;
    }

    let standingsFixed = null, standings = null;
    while (await waitIfNotLoaded(standingsFixed)) {
        standingsFixed = document.getElementById("standings_fixed");
    }

    while (await waitIfNotLoaded(standings)) {
        standings = document.getElementById("standings");
    }

    return [standingsFixed, standings];
}

function getNumOfInfoRows(standingsFixed) {
    return standingsFixed.tBodies[0].rows[0].cells.length - 1;
}

function enhanceFixedStandings(num_of_info_rows, standingsFixed) {
    // настраиваем таблицу для боковой панели
    const table_body = standingsFixed.tBodies[0];

    const head_row = table_body.rows[0];
    const space_row = table_body.rows[1];

    space_row.insertAdjacentElement("afterend", space_row.cloneNode(true));

    for (let i = 0; i < num_of_info_rows; i++) {
        head_row.cells[i].rowSpan = 3;
    }
}

function enhanceStandings(num_of_info_rows, standings) {
    // настраиваем таблицу для основной части
    const table_body = standings.tBodies[0];
    const table_head = standings.tHead;

    const head_row = table_body.rows[0];
    const head_head_row = table_head.rows[0];
    for (let i = 0; i < num_of_info_rows; i++) {
        head_row.cells[i].rowSpan = 3;
        head_head_row.cells[i].rowSpan = 3;
    }

    const task_row = table_body.rows[1];
    const head_task_row = table_head.rows[1];

    const num_of_tasks = task_row.cells.length - 1;
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
    task_row.insertAdjacentElement("afterend", task_row.cloneNode(true));
    head_task_row.insertAdjacentElement("afterend", head_task_row.cloneNode(true));
    populateCountRow(table_body.rows[2]);
    populateCountRow(table_head.rows[2]);

    function populateCountRow(row) {
        // вводим данные в таблицу
        for (let column_i = 0; column_i < num_of_tasks; column_i++) {
            if (row.cells[column_i].textContent === "Σ")
                continue;
            row.cells[column_i].textContent = counter[column_i];
            row.cells[column_i].style.color = "green";
            row.cells[column_i].style.fontWeight = "bold";
        }
    }
}

function configureSortButtons(standingsFixed, standings) {
    // получаем и настраиваем кнопку, добавляю реакцию на клик в конце, чтобы не нарушить работу моего кода
    const score_button = standingsFixed.tBodies[0].rows[0].cells[3];
    const penalty_button = standingsFixed.tBodies[0].rows[0].cells[4];

    const default_color = score_button.style.color;
    const default_weight = score_button.style.fontWeight;
    const new_color = "blue";
    const new_weight = "bold";

    const sort_by_score = (a, b) =>
        (Number(b.cells[3].textContent) - Number(a.cells[3].textContent)) * 100000 +
        (Number(a.cells[4].textContent) - Number(b.cells[4].textContent));

    const sort_by_penalty = (a, b) =>
        (Number(b.cells[4].textContent) - Number(a.cells[4].textContent)) * 100000 +
        (Number(b.cells[3].textContent) - Number(a.cells[3].textContent));

    function activate_button(b) {
        b.style.color = new_color;
        b.style.fontWeight = new_weight;
    }

    function deactivate_button(b) {
        b.style.color = default_color;
        b.style.fontWeight = default_weight;
    }

    activate_button(penalty_button);

    score_button.onclick = () => {
        sortStandingsBy(standingsFixed.tBodies[0], sort_by_score);
        sortStandingsBy(standings.tBodies[0], sort_by_score);
        deactivate_button(score_button);
        activate_button(penalty_button);
    };
    penalty_button.onclick = () => {
        sortStandingsBy(standingsFixed.tBodies[0], sort_by_penalty);
        sortStandingsBy(standings.tBodies[0], sort_by_penalty);
        activate_button(score_button);
        deactivate_button(penalty_button);
    };
}

/** @param {HTMLTableSectionElement} table_body
 * @param { (a: HTMLTableRowElement, b: HTMLTableRowElement) => number} compare_function */
function sortStandingsBy(table_body, compare_function) {
    // выбираем все строки с данными
    /** @type {HTMLTableRowElement[]} */
    const data_rows = Array.from(table_body.rows).slice(3);

    // удаляем их из таблицы
    data_rows.forEach(x => table_body.removeChild(x));

    // сортируем данные
    data_rows.sort(compare_function);

    // добавляем отсортированные строки обратно в таблицу
    data_rows.forEach(x => table_body.appendChild(x));
}

waitForStandingsToLoad().then(([standingsFixed, standings]) => {
    let num_of_info_rows = getNumOfInfoRows(standingsFixed);
    enhanceFixedStandings(num_of_info_rows, standingsFixed);
    enhanceStandings(num_of_info_rows, standings);
    configureSortButtons(standingsFixed, standings);
});
