let timesheetProjectId = null;

let timesheetPeriod = {
    from: getStartOfWeek(),
    to: getEndOfWeekDate()
};

function renderTimesheetView() {
    trackerView.innerHTML = "";

    const filters = createTimesheetFilters();
    const days =
        getTimesheetDays({
            from: timesheetPeriod.from,
            to: timesheetPeriod.to,
            projectId: timesheetProjectId
        });

    const content = createTimesheetContent(days);

    trackerView.append(
        filters,
        content
    );
}


function createTimesheetFilters() {
    const filters = document.createElement("div");
    filters.className = "timesheetFilters";

    const period = document.createElement("div");
    period.className = "timesheetPeriod";

    const fromButton = createTimesheetDateButton({
        date: timesheetPeriod.from,
        onChange: date => {
            date.setHours(0, 0, 0, 0);
            timesheetPeriod.from = date;

            renderTimesheetView();
        }
    });

    const separator = document.createElement("span");
    separator.className = "timesheetPeriodSeparator";
    separator.textContent = "—";

    const toButton = createTimesheetDateButton({
        date: timesheetPeriod.to,
        onChange: date => {
            date.setHours(23, 59, 59, 999);
            timesheetPeriod.to = date;

            renderTimesheetView();
        }
    });

    const projectSelect = createTimesheetProjectSelect();

    period.append(
        fromButton,
        separator,
        toButton
    );

    filters.append(
        period,
        projectSelect
    );

    return filters;
}

function createTimesheetDateButton({
    date,
    onChange
}) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "timesheetDateButton";

    const icon = document.createElement("span");
    icon.className = "material-symbols-rounded";
    icon.textContent = "calendar_today";

    const text = document.createElement("span");
    text.textContent = formatShortDate(date);

    button.append(icon, text);

    button.addEventListener("click", event => {
        event.stopPropagation();

        openDatePicker({
            anchor: button,

            value: {
                date: formatDateForStorage(date),
                time: null
            },

            allowTime: false,

            onChange: ({ date: selectedDate }) => {
                if (!selectedDate) return;

                onChange(
                    parseDate(selectedDate)
                );
            }
        });
    });

    return button;
}

function createTimesheetProjectSelect() {
    const select = document.createElement("select");
    select.className = "timesheetProjectSelect";

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "Все проекты";

    select.append(allOption);

    [...projects]
        .sort((a, b) =>
            a.title.localeCompare(b.title, "ru")
        )
        .forEach(project => {
            const option = document.createElement("option");

            option.value = project.id;
            option.textContent = project.title;

            select.append(option);
        });

    select.value = timesheetProjectId ?? "";

    select.addEventListener("change", () => {
        timesheetProjectId = select.value || null;
        renderTimesheetView();
    });

    return select;
}



function createTimesheetContent(days) {
    const content = document.createElement("div");
    content.className = "timesheetContent";

    const table = document.createElement("table");
    table.className = "timesheetTable";

    table.innerHTML = `
        <thead>
            <tr>
                <th>Проект</th>
                <th>Задача</th>
                <th>Начало</th>
                <th>Окончание</th>
                <th>Время</th>
                <th>Примечание</th>
            </tr>
        </thead>
    `;

    const body = document.createElement("tbody");

    days.forEach(day => {
        appendTimesheetDay(body, day);
    });

    table.append(body);

    const total = createTimesheetTotal(days);

    content.append(table, total);

    return content;
}


function createTimesheetRow(segment) {
    const row = document.createElement("tr");
    row.className = "timesheetEntryRow";

    const entry = segment.entry;
    const task = getTaskById(entry.taskId);
    const project = task
        ? getProjectById(task.projectId)
        : null;

    const startedAt = new Date(segment.startedAt);
    const endedAt = new Date(segment.endedAt);

    row.append(
        createTimesheetCell(project?.title),
        createTimesheetCell(task?.title),
        createTimesheetCell(formatTime(startedAt)),
        createTimesheetCell(
            segment.isRunning
                ? "Сейчас"
                : formatTime(endedAt)
        ),
        createTimesheetCell(
            formatDuration(segment.duration)
        ),
        createTimesheetNoteCell(entry)
    );

    return row;
}

function createTimesheetNoteCell(entry) {
    const cell = document.createElement("td");
    cell.className = "timesheetNoteCell";

    fillTimesheetNoteCell(cell, entry);

    cell.addEventListener("click", event => {
        event.stopPropagation();

        if (cell.classList.contains("is-editing")) {
            return;
        }

        startEditTimesheetNote(cell, entry);
    });

    return cell;
}

function fillTimesheetNoteCell(cell, entry) {
    cell.textContent = entry.note;
    cell.classList.toggle("is-empty", !entry.note);
}

function createTimesheetCell(text) {
    const cell =
        document.createElement("td");

    cell.textContent = text;

    return cell;
}

function appendTimesheetDay(body, day) {
    body.append(createTimesheetDayRow(day));

    if (day.entries.length === 0) {
        body.append(createTimesheetEmptyRow());
        return;
    }

    day.entries.forEach(segment => {
        body.append(createTimesheetRow(segment));
    });
}

function createTimesheetDayRow(day) {
    const row = document.createElement("tr");
    row.className = "timesheetDayRow";

    const dateCell = document.createElement("td");
    dateCell.colSpan = 4;
    dateCell.textContent = formatDateWithWeekday(day.date);

    const totalLabelCell = document.createElement("td");
    totalLabelCell.textContent = formatDuration(day.totalDuration);

    const emptyCell = document.createElement("td");

    row.append(
        dateCell,
        totalLabelCell,
        emptyCell
    );

    return row;
}

function createTimesheetEmptyRow() {
    const row = document.createElement("tr");
    row.className = "timesheetEmptyRow";

    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "Нет записей";

    row.append(cell);

    return row;
}

function createTimesheetTotal(days) {
    const total = document.createElement("div");
    total.className = "timesheetTotal";

    const duration = getTimesheetTotal(days);
    total.textContent = `Итого за период: ${formatDuration(duration)}`;

    return total;
}

function startEditTimesheetNote(cell, entry) {
    cell.classList.add("is-editing");
    cell.innerHTML = "";

    const input = document.createElement("input");

    input.type = "text";
    input.className = "timesheetNoteInput";
    input.value = entry.note ?? "";
    input.placeholder = "Добавить примечание";

    cell.append(input);

    input.focus();
    input.select();

    let finished = false;

    const save = async () => {
        if (finished) return;
        finished = true;

        const note = input.value.trim();

        try {
            await updateTimeEntry(
                entry.id,
                {
                    note: note || null
                }
            );
        } catch (error) {
            console.error(
                "UPDATE TIME ENTRY NOTE ERROR:",
                error
            );
        }

        cell.classList.remove("is-editing");
        fillTimesheetNoteCell(cell, entry);
    };

    const cancel = () => {
        if (finished) return;
        finished = true;

        cell.classList.remove("is-editing");
        fillTimesheetNoteCell(cell, entry);
    };

    input.addEventListener("click", event => {
        event.stopPropagation();
    });

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            input.blur();
        }

        if (event.key === "Escape") {
            event.preventDefault();
            cancel();
        }
    });

    input.addEventListener("blur", save);
}