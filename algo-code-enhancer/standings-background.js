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

function enhanceFixedStandings(numOfInfoRows, standingsFixed) {
    // настраиваем таблицу для боковой панели
    const tableBody = standingsFixed.tBodies[0];

    const headRow = tableBody.rows[0];
    const spaceRow = tableBody.rows[1];

    spaceRow.insertAdjacentElement("afterend", spaceRow.cloneNode(true));

    for (let i = 0; i < numOfInfoRows; i++) {
        headRow.cells[i].rowSpan = 3;
    }
}

function enhanceStandings(numOfInfoRows, standings) {
    // настраиваем таблицу для основной части
    const tableBody = standings.tBodies[0];
    const tableHead = standings.tHead;

    const headRow = tableBody.rows[0];
    const headHeadRow = tableHead.rows[0];
    for (let i = 0; i < numOfInfoRows; i++) {
        headRow.cells[i].rowSpan = 3;
        headHeadRow.cells[i].rowSpan = 3;
    }

    const taskRow = tableBody.rows[1];
    const headTaskRow = tableHead.rows[1];

    const numOfTasks = taskRow.cells.length - 1;
    // подсчитаем количество успешных решений
    const counter = Array(numOfTasks).fill(0);
    for (let row_i = 3; row_i < tableBody.rows.length - 1; row_i++) {
        const row = tableBody.rows[row_i];

        for (let column_i = 0; column_i < numOfTasks; column_i++) {
            if (row.cells[column_i + numOfInfoRows].classList.contains("ok")) {
                counter[column_i]++;
            }
        }
    }
    taskRow.insertAdjacentElement("afterend", taskRow.cloneNode(true));
    headTaskRow.insertAdjacentElement("afterend", headTaskRow.cloneNode(true));
    populateCountRow(tableBody.rows[2]);
    populateCountRow(tableHead.rows[2]);

    function populateCountRow(row) {
        // вводим данные в таблицу
        for (let column_i = 0; column_i < numOfTasks; column_i++) {
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
    const scoreButton = standingsFixed.tBodies[0].rows[0].cells[3];
    const penaltyButton = standingsFixed.tBodies[0].rows[0].cells[4];

    const defaultColor = scoreButton.style.color;
    const defaultWeight = scoreButton.style.fontWeight;
    const newColor = "blue";
    const newWeight = "bold";

    const sortByScore = (a, b) =>
        (Number(b.cells[3].textContent) - Number(a.cells[3].textContent)) * 100000 +
        (Number(a.cells[4].textContent) - Number(b.cells[4].textContent));

    const sortByPenalty = (a, b) =>
        (Number(b.cells[4].textContent) - Number(a.cells[4].textContent)) * 100000 +
        (Number(b.cells[3].textContent) - Number(a.cells[3].textContent));

    function activateButton(b) {
        b.style.color = newColor;
        b.style.fontWeight = newWeight;
    }

    function deactivateButton(b) {
        b.style.color = defaultColor;
        b.style.fontWeight = defaultWeight;
    }

    activateButton(penaltyButton);

    scoreButton.onclick = () => {
        sortStandingsBy(standingsFixed.tBodies[0], sortByScore);
        sortStandingsBy(standings.tBodies[0], sortByScore);
        deactivateButton(scoreButton);
        activateButton(penaltyButton);
    };
    penaltyButton.onclick = () => {
        sortStandingsBy(standingsFixed.tBodies[0], sortByPenalty);
        sortStandingsBy(standings.tBodies[0], sortByPenalty);
        activateButton(scoreButton);
        deactivateButton(penaltyButton);
    };
}

/** @param {HTMLTableSectionElement} tableBody
 * @param { (a: HTMLTableRowElement, b: HTMLTableRowElement) => number} compareFunction */
function sortStandingsBy(tableBody, compareFunction) {
    // выбираем все строки с данными
    /** @type {HTMLTableRowElement[]} */
    const dataRows = Array.from(tableBody.rows).slice(3);

    // удаляем их из таблицы
    dataRows.forEach(x => tableBody.removeChild(x));

    // сортируем данные
    dataRows.sort(compareFunction);

    // добавляем отсортированные строки обратно в таблицу
    dataRows.forEach(x => tableBody.appendChild(x));
}

function HighlightUserRow(standings, userNames) {
    const rows = standings.tBodies[0].rows;

    for (const row of rows) {
        if (row.cells.length > 2 && userNames.includes(row.cells[2].textContent)) {
            row.classList.add("current-user-row");
            return row;
        }
    }
}

function colorTasks(standings, userRow, numOfInfoRows) {
    let taskRow = standings.tBodies[0].rows[1];
    let taskRow2 = standings.tHead.rows[1];
    let numOfTasks = taskRow.cells.length;

    for (let i = 0; i < numOfTasks; i++) {
        let style = userRow.cells[i + numOfInfoRows].classList[0];

        taskRow.cells[i].classList.remove("gray");
        taskRow.cells[i].classList.add(style);
        taskRow2.cells[i].classList.remove("gray");
        taskRow2.cells[i].classList.add(style);
    }
}

waitForStandingsToLoad().then(([standingsFixed, standings]) => {
    let numOfInfoRows = getNumOfInfoRows(standingsFixed);
    enhanceFixedStandings(numOfInfoRows, standingsFixed);
    enhanceStandings(numOfInfoRows, standings);
    configureSortButtons(standingsFixed, standings);

    chrome.runtime.sendMessage({"action": "get_names"}).then((response) => {
        let userRow = HighlightUserRow(standings, response.names);
        HighlightUserRow(standingsFixed, response.names);
        colorTasks(standings, userRow, numOfInfoRows);
    });
});
