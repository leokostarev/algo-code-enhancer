let ALGO_STANDINGS = null;

(async function () {
    while (ALGO_STANDINGS === null || ALGO_STANDINGS.children.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        ALGO_STANDINGS = document.getElementById("standings_fixed");
    }
    let penalty = ALGO_STANDINGS.children[0].children[0].children[4];

    penalty.style.color = "blue";
    penalty.style.fontWeight = "bold";
    penalty.onclick = AlgoPenaltySort;
})();


function AlgoPenaltySort() {
    let table_body = ALGO_STANDINGS.children[0];

    // выбираем все строки с данными
    /** @type {HTMLTableRowElement[]} */
    let data_rows = [];
    for (let i = 2; i < table_body.children.length; i++) {
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