{
    entry,
        startedAt,
        endedAt,
        duration
}

function splitTimeEntryByDay(entry) {
    const segments = [];
    let segmentStart = entry.startedAt;
    const entryEnd = entry.endedAt ?? Date.now();

    while (segmentStart < entryEnd) {
        const startDate = new Date(segmentStart);
        const nextDay = new Date(startDate);

        nextDay.setHours(
            24,
            0,
            0,
            0
        );

        const segmentEnd =
            Math.min(
                entryEnd,
                nextDay.getTime()
            );

        segments.push({
            entry,
            startedAt: segmentStart,
            endedAt: segmentEnd,

            duration: Math.floor(
                (
                    segmentEnd -
                    segmentStart
                ) / 1000
            ),

            isRunning:
                entry.endedAt === null &&
                segmentEnd === entryEnd
        });

        segmentStart = segmentEnd;
    }

    return segments;
}


function getTimesheetEntries({
    from,
    to,
    projectId = null
}) {
    let entries =
        getTimeEntriesByPeriod(
            from,
            to
        );

    if (projectId) {
        entries = entries.filter(entry => {
            const task =
                getTaskById(entry.taskId);

            return task?.projectId === projectId;
        });
    }

    return entries.sort(
        (a, b) =>
            a.startedAt - b.startedAt
    );
}

function getTimesheetDays({
    from,
    to,
    projectId = null
}) {
    const days =
        createTimesheetDays(
            from,
            to
        );

    const entries =
        getTimesheetEntries({
            from,
            to,
            projectId
        });

    entries.forEach(entry => {
        const segments =
            splitTimeEntryByDay(entry);

        segments.forEach(segment => {
            const date =
                new Date(
                    segment.startedAt
                );

            const dateKey =
                formatDateForStorage(date);

            const day =
                days.get(dateKey);

            if (!day) {
                return;
            }

            day.entries.push(segment);

            day.totalDuration +=
                segment.duration;
        });
    });

    return [...days.values()];
}

function getTimesheetTotal(days) {
    return days.reduce(
        (total, day) =>
            total +
            day.totalDuration,
        0
    );
}

function createTimesheetDays(
    from,
    to
) {
    const days = new Map();

    const current =
        new Date(from);

    current.setHours(
        0,
        0,
        0,
        0
    );

    const last =
        new Date(to);

    last.setHours(
        0,
        0,
        0,
        0
    );

    while (current <= last) {
        const date =
            new Date(current);

        const dateKey =
            formatDateForStorage(date);

        days.set(dateKey, {
            date,
            entries: [],
            totalDuration: 0
        });

        current.setDate(
            current.getDate() + 1
        );
    }

    return days;
}


