let timesheetProjectId = null;

let timesheetPeriod = {
    from: getStartOfWeek(),
    to: getEndOfWeekDate()
};

function renderTimesheetView() {
    trackerView.innerHTML = "";

    const filters =
        createTimesheetFilters();

    const entries =
        getFilteredTimesheetEntries();

    const content =
        createTimesheetContent(entries);

    trackerView.append(
        filters,
        content
    );
}


function createTimesheetFilters() {
    const filters =
        document.createElement("div");

    filters.className =
        "timesheetFilters";

    const fromInput =
        document.createElement("input");

    fromInput.type = "date";
    fromInput.className =
        "timesheetDateInput";

    fromInput.value =
        formatDateForStorage(
            timesheetPeriod.from
        );

    const toInput =
        document.createElement("input");

    toInput.type = "date";
    toInput.className =
        "timesheetDateInput";

    toInput.value =
        formatDateForStorage(
            timesheetPeriod.to
        );


    fromInput.addEventListener(
        "change",
        () => {
            const date =
                parseDate(fromInput.value);

            if (!date) return;

            date.setHours(0, 0, 0, 0);

            timesheetPeriod.from = date;

            renderTimesheetView();
        }
    );

    toInput.addEventListener(
        "change",
        () => {
            const date =
                parseDate(toInput.value);

            if (!date) return;

            date.setHours(
                23,
                59,
                59,
                999
            );

            timesheetPeriod.to = date;

            renderTimesheetView();
        }
    );


    const projectSelect =
        document.createElement("select");

    projectSelect.className =
        "timesheetProjectSelect";

    const allProjectsOption =
        document.createElement("option");

    allProjectsOption.value = "";
    allProjectsOption.textContent =
        "Все проекты";

    projectSelect.append(
        allProjectsOption
    );

    projects.forEach(project => {
        const option =
            document.createElement("option");

        option.value = project.id;
        option.textContent = project.title;

        projectSelect.append(option);
    });

    projectSelect.value =
        timesheetProjectId ?? "";


    projectSelect.addEventListener(
        "change",
        () => {
            timesheetProjectId =
                projectSelect.value || null;

            renderTimesheetView();
        }
    );



    filters.append(
        fromInput,
        toInput,
        projectSelect
    );

    return filters;
}

function createTimesheetContent(entries) {
    const content =
        document.createElement("div");

    content.className =
        "timesheetContent";

    if (entries.length === 0) {
        const empty =
            document.createElement("div");

        empty.className =
            "timesheetEmpty";

        empty.textContent =
            "За выбранный период записей нет";

        content.append(empty);

        return content;
    }

    const table =
        document.createElement("table");

    table.className =
        "timesheetTable";

    table.innerHTML = `
        <thead>
            <tr>
                <th>Проект</th>
                <th>Задача</th>
                <th>Примечание</th>
                <th>Начало</th>
                <th>Окончание</th>
                <th>Время</th>
            </tr>
        </thead>
    `;

    const body =
        document.createElement("tbody");

    entries.forEach(entry => {
        body.append(
            createTimesheetRow(entry)
        );
    });

    table.append(body);

    const totalSeconds =
        entries.reduce(
            (total, entry) =>
                total +
                getTimeEntryDuration(entry),
            0
        );

    const total =
        document.createElement("div");

    total.className =
        "timesheetTotal";

    total.textContent =
        `Итого: ${formatDuration(totalSeconds)}`;

    content.append(
        table,
        total
    );

    return content;
}


function createTimesheetRow(entry) {
    const row =
        document.createElement("tr");

    const task =
        getTaskById(entry.taskId);

    const project = task
        ? getProjectById(task.projectId)
        : null;

    const startedAt =
        new Date(entry.startedAt);

    const endedAt = entry.endedAt
        ? new Date(entry.endedAt)
        : null;

    row.append(
        createTimesheetCell(
            project?.title ?? "—"
        ),
        createTimesheetCell(
            task?.title ?? "—"
        ),
        createTimesheetCell(
            entry.note || "—"
        ),
        createTimesheetCell(
            formatTime(startedAt)
        ),
        createTimesheetCell(
            endedAt
                ? formatTime(endedAt)
                : "Сейчас"
        ),
        createTimesheetCell(
            formatDuration(
                getTimeEntryDuration(entry)
            )
        )
    );

    return row;
}

function createTimesheetCell(text) {
    const cell =
        document.createElement("td");

    cell.textContent = text;

    return cell;
}

function getFilteredTimesheetEntries() {
    const entries =
        getTimeEntriesByPeriod(
            timesheetPeriod.from,
            timesheetPeriod.to
        );

    if (!timesheetProjectId) {
        return entries;
    }

    return entries.filter(entry => {
        const task =
            getTaskById(entry.taskId);

        return (
            task?.projectId ===
            timesheetProjectId
        );
    });
}