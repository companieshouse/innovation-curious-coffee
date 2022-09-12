const columns = ["name", "email", "department"];

function applyFilter() {
    const input = document.getElementById("filter-text");
    if (input === null) throw "Unable to find filter input element";
    const fieldSelection = document.getElementById("field-selection");
    if (fieldSelection === null) throw "Unable to find field selection element";

    const fieldName = fieldSelection.value;
    const filterText = input.value;

    const rows = document.querySelectorAll("#participant-table > tbody > tr");

    const fieldIndex = columns.indexOf(fieldName);

    rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td"));

        const matchFunction = (cell) =>
            cell.textContent.toLowerCase().includes(filterText.toLowerCase());

        const matchesFilter = matchFunction(cells[fieldIndex]);
        if (!matchesFilter) {
            $(row).addClass("hidden");
        } else {
            $(row).removeClass("hidden");
        }
    });
}

function addClass(el) {
    const classList = el.classList;
}
