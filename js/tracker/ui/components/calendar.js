function renderCalendar({
    container,
    value = null,
    onSelect
}) {
    let selectedValue = value;

    const date = value
        ? parseDate(value)
        : new Date();

    let year = date.getFullYear();
    let month = date.getMonth();

    render();

    function render() {
        container.innerHTML = `
            <div class="calendarHeader">
                <button class="calendarNavButton" data-calendar-action="prev">
                    <span class="material-symbols-rounded">
                        chevron_left
                    </span>
                </button>

                <span class="calendarTitle">
                    ${getMonthTitle(year, month)}
                </span>

                <button class="calendarNavButton" data-calendar-action="next">
                    <span class="material-symbols-rounded">
                        chevron_right
                    </span>
                </button>
            </div>

            <div class="calendarWeekdays">
                <span>Пн</span>
                <span>Вт</span>
                <span>Ср</span>
                <span>Чт</span>
                <span>Пт</span>
                <span>Сб</span>
                <span>Вс</span>
            </div>

            <div class="calendarDays"></div>
        `;

        const daysContainer =
            container.querySelector(".calendarDays");

        renderCalendarDays({
            container: daysContainer,
            year,
            month,
            value: selectedValue,

            onSelect: (date) => {
                selectedValue = date;
                onSelect?.(date);
            }
        });


        bindNavigation();
    }

    function bindNavigation() {
        const prevButton =
            container.querySelector('[data-calendar-action="prev"]');

        const nextButton =
            container.querySelector('[data-calendar-action="next"]');

        prevButton.addEventListener("click", (event) => {
            event.stopPropagation();

            month--;

            if (month < 0) {
                month = 11;
                year--;
            }

            render();
        });

        nextButton.addEventListener("click", (event) => {
            event.stopPropagation();

            month++;

            if (month > 11) {
                month = 0;
                year++;
            }

            render();
        });
    }
}

function getMonthTitle(year, month) {
    const date = new Date(year, month);

    const monthName = date.toLocaleDateString("ru-RU", {
        month: "long"
    });

    return `${monthName[0].toUpperCase()}${monthName.slice(1)} ${year}`;
}

function renderCalendarDays({
    container,
    year,
    month,
    value,
    onSelect
}) {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let startDay = firstDay.getDay();

    // JS: Вс = 0, Пн = 1...
    // Нам нужно: Пн = 0, ... Вс = 6
    startDay = (startDay + 6) % 7;

    // Пустые ячейки до первого числа месяца
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendarDayEmpty";

        container.appendChild(empty);
    }

    const today = new Date();

    const selectedDate = value
        ? parseDate(value)
        : null;

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);

        const button = document.createElement("button");

        button.className = "calendarDay";
        button.textContent = day;

        // Прошедшая дата
        button.classList.toggle(
            "is-past",
            currentDate < startOfToday()
        );

        // Выходной
        button.classList.toggle(
            "is-weekend",
            currentDate.getDay() === 0 ||
            currentDate.getDay() === 6
        );

        // Сегодня
        button.classList.toggle(
            "is-today",
            isSameDate(currentDate, today)
        );

        // Выбранная дата
        button.classList.toggle(
            "is-selected",
            selectedDate && isSameDate(currentDate, selectedDate)
        );

        button.addEventListener("click", () => {
            container
                .querySelector(".calendarDay.is-selected")
                ?.classList.remove("is-selected");

            button.classList.add("is-selected");

            onSelect?.(
                formatDateForStorage(currentDate)
            );
        });

        container.appendChild(button);
    }
}