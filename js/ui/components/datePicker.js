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

    let selectedDate = value?.date ?? null;

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

    if (timeInput) {
        timeInput.value = value?.time ?? "";
    }

    renderCalendar({
        container: calendar,
        value: selectedDate,

        onSelect: (date) => {
            selectedDate = date;

            onChange?.({
                date: selectedDate,
                time: getTimeValue(timeInput)
            });
        }
    });

    bindDatePickerEvents({
        picker,
        onChange,
        timeInput,

        getSelectedDate: () => selectedDate,

        setSelectedDate: (date) => {
            selectedDate = date;
        }
    });
}

function getTimeValue(timeInput) {
    if (!timeInput) return null;

    return normalizeTime(timeInput.value);
}

function positionDatePicker(picker, anchor) {
    const rect = anchor.getBoundingClientRect();

    picker.style.position = "fixed";
    picker.style.top = `${rect.bottom + 6}px`;
    picker.style.left = `${rect.left}px`;
}

function bindDatePickerEvents({
    picker,
    onChange,
    timeInput,
    getSelectedDate,
    setSelectedDate
}) {
    picker.addEventListener("click", (event) => {
        const option =
            event.target.closest("[data-action]");

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
                clearDate();
                break;
        }
    });

    function saveTime() {
        const time = normalizeTime(
            timeInput.value
        );

        if (!time) return;

        let selectedDate = getSelectedDate();

        // Если ввели только время —
        // автоматически ставим сегодняшний день
        if (!selectedDate) {
            selectedDate = getDateOffset(0);
            setSelectedDate(selectedDate);
        }

        timeInput.value = time;

        onChange?.({
            date: selectedDate,
            time
        });
    }

    timeInput?.addEventListener(
        "blur",
        saveTime
    );

    timeInput?.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                saveTime();
                timeInput.blur();
            }
        }
    );

    function selectDate(date) {
        setSelectedDate(date);

        onChange?.({
            date,
            time: getTimeValue(timeInput)
        });
    }

    function clearDate() {
        setSelectedDate(null);

        if (timeInput) {
            timeInput.value = "";
        }

        onChange?.({
            date: null,
            time: null
        });
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