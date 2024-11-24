/**
 *  @return {Promise<[HTMLElement, HTMLElement]>}
 */
async function loadStandings() {
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

    return [standings, standingsFixed];
}


/**
 * @param {HTMLTableElement} standingsFixed
 * @returns {number}
 */
function getNumOfInfoCols(standingsFixed) {
    return standingsFixed.tBodies[0].rows[0].cells.length - 1;
}


/**
 * @param {number} numOfInfoCols
 * @param {HTMLTableElement} standingsFixed
 */
function enhanceFixedStandings(numOfInfoCols, standingsFixed) {
    // настраиваем таблицу для боковой панели
    const tableBody = standingsFixed.tBodies[0];

    const headRow = tableBody.rows[0];
    const spaceRow = tableBody.rows[1];

    spaceRow.insertAdjacentElement("afterend", spaceRow.cloneNode(true));

    for (let i = 0; i < numOfInfoCols; i++) {
        headRow.cells[i].rowSpan = 3;
    }
}


/**
 * @param {number} numOfInfoCols
 * @param {HTMLTableElement} standings
 */
function enhanceStandings(numOfInfoCols, standings) {
    // настраиваем таблицу для основной части
    const tableBody = standings.tBodies[0];
    const tableHead = standings.tHead;

    const headRow = tableBody.rows[0];
    const headHeadRow = tableHead.rows[0];
    for (let i = 0; i < numOfInfoCols; i++) {
        headRow.cells[i].rowSpan = 3;
        headHeadRow.cells[i].rowSpan = 3;
    }

    const taskRow = tableBody.rows[1];
    const headTaskRow = tableHead.rows[1];

    const numOfTasks = taskRow.cells.length;
    // подсчитаем количество успешных решений
    const counter = Array(numOfTasks).fill(0);
    for (let row_i = 2; row_i < tableBody.rows.length; row_i++) {
        const row = tableBody.rows[row_i];

        for (let column_i = 0; column_i < numOfTasks; column_i++) {
            const cell = row.cells[column_i + numOfInfoCols];
            if (cell.classList.contains("ok") || cell.textContent === "100") {
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
            const cell = row.cells[column_i];

            if (cell.textContent === "Σ" || cell.textContent === "Mark") {
                continue;
            }
            cell.textContent = counter[column_i];
            cell.style.color = "green";
            cell.style.fontWeight = "bold";
        }
    }
}


/**
 * @param {HTMLTableElement} standingsFixed
 * @param {HTMLTableElement} standings
 */
function configureSortButtons(standingsFixed, standings) {
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

/**
 * @param {HTMLTableSectionElement} tableBody
 * @param { (a: HTMLTableRowElement, b: HTMLTableRowElement) => number} compareFunction
 */
function sortStandingsBy(tableBody, compareFunction) {
    // выбираем все строки с данными
    const dataRows = Array.from(tableBody.rows).slice(3);

    // удаляем их из таблицы
    dataRows.forEach(x => tableBody.removeChild(x));

    // сортируем данные
    dataRows.sort(compareFunction);

    // добавляем отсортированные строки обратно в таблицу
    dataRows.forEach(x => tableBody.appendChild(x));
}

/**
 * @param {HTMLTableElement} standings
 * @param {string} names
 * @returns {HTMLTableRowElement[]}
 */
function getMatchingRows(standings, names) {
    // удаляем все пробелы в именах, это необходимо в редких случаях
    names = names.replace(/\s/g, "");
    const rows = standings.tBodies[0].rows;
    const matchingRows = [];
    for (let row_i = 3; row_i < rows.length; row_i++) {
        const row = rows[row_i];
        if (row.cells.length <= 2) {
            continue;
        }
        if (names.includes(row.cells[2].textContent.replace(/\s/g, ""))) {
            matchingRows.push(row);
        }
    }
    return matchingRows;
}

/**
 * @param {HTMLTableRowElement[]} rows - An array of table rows to be highlighted.
 */
function highlightRows(rows) {
    for (const row of rows) {
        row.classList.add("highlight-row");
    }
}

/**
 * @param {HTMLTableRowElement} row
 */
function underlineRow(row) {
    row.classList.add("underline-row");
}

/**
 * @param numOfInfoCols {number}
 * @param standings {HTMLTableElement}
 * @param userRow {HTMLTableRowElement}
 */
function colorTasks(numOfInfoCols, standings, userRow) {
    const taskRow = standings.tBodies[0].rows[1];
    const taskRow2 = standings.tHead.rows[1];
    const numOfTasks = taskRow.cells.length;

    // таблица с подгруппами
    const isWeightedMode = userRow.cells[numOfInfoCols].style.backgroundColor.length > 10;

    for (let i = 0; i < numOfTasks; i++) {
        if (!isWeightedMode) {
            const style = userRow.cells[i + numOfInfoCols].classList[0];
            taskRow.cells[i].classList.remove("gray");
            taskRow.cells[i].classList.add(style);
            taskRow2.cells[i].classList.remove("gray");
            taskRow2.cells[i].classList.add(style);
        } else {
            const style = userRow.cells[i + numOfInfoCols].style.backgroundColor;
            taskRow.cells[i].style.backgroundColor = style;
            taskRow2.cells[i].style.backgroundColor = style;
        }
    }
}

/**
 * @param {HTMLTableElement} standings
 * @param {HTMLTableRowElement[]} rows
 * @param {string} mode
 */
function moveRowsUp(standings, rows, mode) {
    if (mode === "no") return;

    const body = standings.tBodies[0];
    const doRemove = mode === "move";
    let lastRow = null;
    let index = 3;
    for (const row of rows) {
        body.replaceChild(
            lastRow = doRemove
                ? body.removeChild(row)
                : row.cloneNode(true),
            body.insertRow(index),
        );
        index++;
    }

    if (lastRow) {
        underlineRow(lastRow);
    }
}

/**
 * @param {HTMLTableRowElement[]} rows
 * @returns {HTMLTableRowElement[]}
 */
function dedupRows(rows) {
    let map = new Map();
    for (let i of rows) {
        map.set(i.cells[0].textContent, i);
    }
    return Array
        .from(map.values())
        .toSorted((a, b) => a.cells[0].textContent - b.cells[0].textContent);
}

async function main() {
    const [standings, standingsFixed] = await loadStandings();

    const numOfInfoCols = getNumOfInfoCols(standingsFixed);
    enhanceStandings(numOfInfoCols, standings);
    enhanceFixedStandings(numOfInfoCols, standingsFixed);

    const response = await chrome.runtime.sendMessage({action: "get"});

    const userRow = getMatchingRows(standings, response.names);
    const userRowFixed = getMatchingRows(standingsFixed, response.names);
    const friendsRows = getMatchingRows(standings, response.friends);
    const friendsRowsFixed = getMatchingRows(standingsFixed, response.friends);

    const dedupedRows = dedupRows([...userRow, ...friendsRows]);
    const dedupedRowsFixed = dedupRows([...userRowFixed, ...friendsRowsFixed]);

    moveRowsUp(standings, dedupedRows, response.move);
    moveRowsUp(standingsFixed, dedupedRowsFixed, response.move);
    if (response.move !== "move") {
        highlightRows(dedupedRows);
        highlightRows(dedupedRowsFixed);
    }

    if (userRow.length > 0) {
        colorTasks(numOfInfoCols, standings, userRow[0]);
    }

    // добавляю сортировки в конце, чтобы логику нельзя было сломать
    configureSortButtons(standingsFixed, standings);
}

main();
