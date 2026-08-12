let activeDatePicker = null;

function openDatePicker({
    anchor,
    value = null,
    allowTime = false,
    onChange
}) {
    closeDatePicker();

    const picker = document.createElement("div");
    picker.className = "datePicker";

    let selectedDate = value
        ? value.split("T")[0]
        : null;

    picker.innerHTML = `
    <div class="datePickerQuickActions">
        <button class="datePickerOption" data-action="today">
            Сегодня
        </button>

        <button class="datePickerOption" data-action="tomorrow">
            Завтра
        </button>

        <button class="datePickerOption" data-action="dayAfterTomorrow">
            Послезавтра
        </button>

        <button class="datePickerOption" data-action="clear">
            Без срока
        </button>
    </div>

    <div class="datePickerDivider"></div>

    <div class="datePickerCalendar"></div>
    ${allowTime ? `
    <div class="datePickerDivider"></div>

    <div class="datePickerTime">
        <span class="material-symbols-rounded">
            schedule
        </span>

    <input
        class="datePickerTimeInput"
        type="text"
        placeholder="Время"
        maxlength="5"
        inputmode="numeric"
    >
    </div>
` : ""}
`;

    document.body.appendChild(picker);

    activeDatePicker = picker;

    positionDatePicker(picker, anchor);

    const calendar = picker.querySelector(".datePickerCalendar");
    const timeInput = picker.querySelector(".datePickerTimeInput");

    if (timeInput && value?.includes("T")) {
        timeInput.value = value.split("T")[1].slice(0, 5);
    }

    renderCalendar({
        container: calendar,
        value,

        onSelect: (date) => {
            selectedDate = date;

            const time = timeInput?.value;

            const result = time
                ? `${selectedDate}T${time}`
                : selectedDate;

            onChange?.(result);
        }
    });

    bindDatePickerEvents({
        picker,
        value,
        allowTime,
        onChange,
        timeInput,

        getSelectedDate: () => selectedDate,
        setSelectedDate: (date) => {
            selectedDate = date;
        }
    });
}


function positionDatePicker(picker, anchor) {
    const rect = anchor.getBoundingClientRect();

    picker.style.position = "fixed";
    picker.style.top = `${rect.bottom + 6}px`;
    picker.style.left = `${rect.left}px`;
}



function bindDatePickerEvents({
    picker,
    value,
    allowTime,
    onChange,
    timeInput,
    getSelectedDate,
    setSelectedDate
}) {
    picker.addEventListener("click", (event) => {
        const option = event.target.closest("[data-action]");

        if (!option) return;

        const action = option.dataset.action;

        switch (action) {
            case "today":
                selectDate(getDateOffset(0));
                break;

            case "tomorrow":
                selectDate(getDateOffset(1));
                break;

            case "dayAfterTomorrow":
                selectDate(getDateOffset(2));
                break;

            case "clear":
                selectDate(null);
                break;
        }
    });

    // Сохранение времени
    function saveTime() {
        const time = normalizeTime(timeInput.value);

        if (!time) return;

        let selectedDate = getSelectedDate();

        // Если даты нет — ставим сегодня
        if (!selectedDate) {
            selectedDate = getDateOffset(0);
            setSelectedDate(selectedDate);
        }

        timeInput.value = time;

        onChange?.(`${selectedDate}T${time}`);
    }

    // Сохраняем при уходе из поля
    timeInput?.addEventListener("blur", saveTime);

    // Или по Enter
    timeInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            saveTime();
            timeInput.blur();
        }
    });

    function selectDate(date) {
        if (!date) {
            setSelectedDate(null);
            onChange?.(null);
            return;
        }

        setSelectedDate(date);

        const time = timeInput?.value;

        const result = time
            ? `${date}T${time}`
            : date;

        onChange?.(result);
    }
}

function closeDatePicker() {
    if (!activeDatePicker) return;

    activeDatePicker.remove();
    activeDatePicker = null;
}

document.addEventListener("click", (event) => {
    if (!activeDatePicker) return;

    if (activeDatePicker.contains(event.target)) return;

    closeDatePicker();
});