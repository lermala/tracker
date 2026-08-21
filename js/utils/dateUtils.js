function formatDueDate(dueDate, dueTime = null) {
    if (!dueDate) return "";

    const date = parseDate(dueDate);
    const today = startOfToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dateText;

    if (isSameDate(date, today)) {
        dateText = "Сегодня";
    } else if (isSameDate(date, tomorrow)) {
        dateText = "Завтра";
    } else {
        dateText = date
            .toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short"
            })
            .replace(".", "");
    }

    return dueTime
        ? `${dateText} ${dueTime}`
        : dateText;
}

function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function getDateOffset(days) {
    const date = new Date();

    date.setDate(date.getDate() + days);

    return formatDateForStorage(date);
}

function formatDateForStorage(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseDate(value) {
    if (!value) return null;

    const [year, month, day] = value
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day);
}

function startOfToday() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
}

function getDueDateStatus(dueDate) {
    if (!dueDate) return "empty";

    const date = parseDate(dueDate);
    const today = startOfToday();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date < today) {
        return "overdue";
    }

    if (isSameDate(date, today)) {
        return "today";
    }

    if (isSameDate(date, tomorrow)) {
        return "tomorrow";
    }

    const endOfThisWeek = getEndOfWeek(today);
    const endOfNextWeek = new Date(endOfThisWeek);
    endOfNextWeek.setDate(endOfThisWeek.getDate() + 7);

    if (date <= endOfThisWeek) {
        return "this-week";
    }

    if (date <= endOfNextWeek) {
        return "next-week";
    }

    return "default";
}

function getEndOfWeek(date) {
    const result = new Date(date);

    const day = result.getDay();

    // Сколько дней осталось до воскресенья
    const daysUntilSunday = day === 0
        ? 0
        : 7 - day;

    result.setDate(result.getDate() + daysUntilSunday);
    result.setHours(23, 59, 59, 999);

    return result;
}

function getStartOfWeek(date = new Date()) {
    const result = new Date(date);

    const day = result.getDay();

    const diff =
        day === 0
            ? -6
            : 1 - day;

    result.setDate(
        result.getDate() + diff
    );

    result.setHours(0, 0, 0, 0);

    return result;
}

function getEndOfWeekDate(date = new Date()) {
    const result =
        getStartOfWeek(date);

    result.setDate(
        result.getDate() + 6
    );

    result.setHours(
        23,
        59,
        59,
        999
    );

    return result;
}

function normalizeTime(value) {
    const input = value.trim();

    if (!input) return null;

    let hours;
    let minutes;

    // 9:30 / 09:30 / 18:30
    if (input.includes(":")) {
        const parts = input.split(":");

        if (parts.length !== 2) return null;

        hours = Number(parts[0]);
        minutes = Number(parts[1]);
    }

    // 9 / 18 → 09:00 / 18:00
    else if (input.length <= 2) {
        hours = Number(input);
        minutes = 0;
    }

    // 930 → 09:30
    else if (input.length === 3) {
        hours = Number(input.slice(0, 1));
        minutes = Number(input.slice(1));
    }

    // 1830 → 18:30
    else if (input.length === 4) {
        hours = Number(input.slice(0, 2));
        minutes = Number(input.slice(2));
    }

    else {
        return null;
    }

    if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function isToday(value) {
    if (!value) return false;

    return isSameDate(
        parseDate(value),
        startOfToday()
    );
}



function formatDuration(seconds) {
    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor((seconds % 3600) / 60);

    const secs =
        seconds % 60;

    return [
        hours,
        minutes,
        secs
    ]
        .map(value =>
            String(value).padStart(2, "0")
        )
        .join(":");
}

function formatTime(date) {
    return date.toLocaleTimeString(
        "ru-RU",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

function formatDateWithWeekday(date) {
    const weekday = date
        .toLocaleDateString("ru-RU", {
            weekday: "short"
        })
        .replace(".", "");

    const day = date.getDate();

    const month = date
        .toLocaleDateString("ru-RU", {
            month: "short"
        })
        .replace(".", "");

    return `${weekday}, ${day} ${month}`;
}

function formatShortDate(date) {
    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}