let calendarDate = new Date();

function renderCalendarView() {
    trackerView.innerHTML = "";
    cleanupDurationElements();

    const calendar = document.createElement("div");
    calendar.className = "taskCalendar";

    calendar.append(
        createCalendarHeader(),
        createCalendarWeekdays(),
        createCalendarGrid()
    );

    trackerView.append(calendar);
    initCalendarSortable();
}

function createCalendarHeader() {
    const header = document.createElement("div");
    header.className = "taskCalendarHeader";

    const title = document.createElement("div");
    title.className = "taskCalendarTitle";

    title.textContent = calendarDate.toLocaleDateString(
        "ru-RU",
        {
            month: "long",
            year: "numeric"
        }
    );

    const navigation = document.createElement("div");
    navigation.className = "taskCalendarNavigation";

    const prevButton = createCalendarNavigationButton(
        "chevron_left",
        () => changeCalendarMonth(-1)
    );

    const todayButton = document.createElement("button");
    todayButton.className = "taskCalendarTodayButton";
    todayButton.textContent = "Сегодня";

    todayButton.addEventListener("click", () => {
        calendarDate = new Date();
        renderCalendarView();
    });

    const nextButton = createCalendarNavigationButton(
        "chevron_right",
        () => changeCalendarMonth(1)
    );

    navigation.append(
        prevButton,
        todayButton,
        nextButton
    );

    header.append(
        title,
        navigation
    );

    return header;
}

function createCalendarNavigationButton(
    icon,
    onClick
) {
    const button = document.createElement("button");
    button.className = "taskCalendarNavigationButton";

    const iconElement = document.createElement("span");
    iconElement.className = "material-symbols-rounded";
    iconElement.textContent = icon;

    button.append(iconElement);
    button.addEventListener("click", onClick);

    return button;
}

function changeCalendarMonth(offset) {
    calendarDate = new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + offset,
        1
    );

    renderCalendarView();
}

function createCalendarWeekdays() {
    const weekdays = document.createElement("div");
    weekdays.className = "taskCalendarWeekdays";

    [
        "Пн",
        "Вт",
        "Ср",
        "Чт",
        "Пт",
        "Сб",
        "Вс"
    ].forEach(day => {
        const element = document.createElement("div");

        element.className =
            "taskCalendarWeekday";

        element.textContent = day;

        weekdays.append(element);
    });

    return weekdays;
}

function createCalendarGrid() {
    const grid = document.createElement("div");
    grid.className = "taskCalendarGrid";

    const dates = getCalendarDates(calendarDate);
    const visibleTasks = getVisibleTasks();

    dates.forEach(date => {
        grid.append(
            createCalendarDay(
                date,
                visibleTasks
            )
        );
    });

    return grid;
}

function getCalendarDates(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);

    // JS: воскресенье = 0.
    // Нам нужен понедельник = 0.
    const firstDayIndex =
        (firstDay.getDay() + 6) % 7;

    const startDate = new Date(
        year,
        month,
        1 - firstDayIndex
    );

    const dates = [];

    // Всегда рисуем 6 недель.
    for (let i = 0; i < 42; i++) {
        const current = new Date(startDate);

        current.setDate(
            startDate.getDate() + i
        );

        dates.push(current);
    }

    return dates;
}

function createCalendarDay(
    date,
    visibleTasks
) {
    const day = document.createElement("div");
    day.className = "taskCalendarDay";

    const isCurrentMonth =
        date.getMonth() === calendarDate.getMonth();

    day.classList.toggle(
        "is-outside-month",
        !isCurrentMonth
    );

    day.classList.toggle(
        "is-today",
        isSameDate(date, new Date())
    );

    const dayOfWeek = date.getDay();

    day.classList.toggle(
        "is-weekend",
        dayOfWeek === 0 || dayOfWeek === 6
    );

    const dateValue = formatDateForStorage(date);

    day.dataset.date = dateValue;

    const number = document.createElement("div");
    number.className = "taskCalendarDayNumber";
    number.textContent = date.getDate();

    const tasksContainer =
        document.createElement("div");

    tasksContainer.className =
        "taskCalendarDayTasks";

    tasksContainer.dataset.date = dateValue;

    const dayTasks = visibleTasks.filter(
        task => task.dueDate === dateValue
    );

    dayTasks.forEach(task => {
        tasksContainer.append(
            createCalendarTask(task)
        );
    });

    day.append(
        number,
        tasksContainer
    );

    return day;
}

function createCalendarTask(task) {
    const element = document.createElement("button");
    element.className = "taskCalendarTask";

    element.dataset.taskId = task.id;

    if (task.isCompleted) {
        element.classList.add("is-completed");
    }

    if (task.dueTime) {
        const time = document.createElement("span");
        time.className = "taskCalendarTaskTime";
        time.textContent = task.dueTime;

        element.append(time);
    }

    const title = document.createElement("span");
    title.className = "taskCalendarTaskTitle";
    title.textContent = task.title || "Без названия";

    element.append(title);

    element.addEventListener("click", event => {
        event.stopPropagation();

        openTaskCard(task);
    });

    return element;
}