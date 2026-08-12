function formatDueAt(dueAt) {
    if (!dueAt) return "";

    const date = parseDate(dueAt);
    const today = startOfToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    let dateText;

    if (isSameDate(date, today)) {
        dateText = "Сегодня";
    } else if (isSameDate(date, tomorrow)) {
        dateText = "Завтра";
    } else if (isSameDate(date, dayAfterTomorrow)) {
        dateText = "Послезавтра";
    } else {
        dateText = date
            .toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short"
            })
            .replace(".", "");
    }

    const time = getTimeFromDate(dueAt);

    return time
        ? `${dateText} ${time}`
        : dateText;
}

function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function isDueAtOverdue(dueAt) {
    if (!dueAt) return false;

    const datePart = dueAt.split("T")[0];

    const [year, month, day] = datePart
        .split("-")
        .map(Number);

    const due = new Date(year, month - 1, day);
    due.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return due < today;
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
    const datePart = value.split("T")[0];

    const [year, month, day] = datePart
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day);
}

function startOfToday() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
}

function getDueAtStatus(dueAt) {
    if (!dueAt) return "empty";

    const date = parseDate(dueAt);
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

function getTimeFromDate(value) {
    if (!value?.includes("T")) {
        return null;
    }

    return value
        .split("T")[1]
        .slice(0, 5);
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

    const date = typeof value === "string"
        ? parseDate(value)
        : new Date(value);

    return isSameDate(
        date,
        startOfToday()
    );
}