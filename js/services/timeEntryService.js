let timeEntries = [];

function createTimeEntry({
    taskId,
    note = ""
}) {
    const now = Date.now();

    return createTimeEntryModel({
        id: crypto.randomUUID(),
        taskId,
        userId: null,

        startedAt: now,
        endedAt: null,

        note,

        createdAt: null,
        updatedAt: null
    });
}

async function loadTimeEntries() {
    timeEntries =
        await getTimeEntriesFromDb();

    return timeEntries;
}

function getTimeEntries() {
    return timeEntries;
}

function getTimeEntriesByTask(taskId) {
    return timeEntries.filter(
        entry => entry.taskId === taskId
    );
}

function getActiveTimeEntry() {
    return timeEntries.find(
        entry => entry.endedAt === null
    ) ?? null;
}

function getActiveTimeEntryByTask(taskId) {
    return timeEntries.find(
        entry =>
            entry.taskId === taskId &&
            entry.endedAt === null
    ) ?? null;
}



async function startTimeEntry(taskId) {
    const activeEntry =
        getActiveTimeEntry();

    if (activeEntry) {
        await stopTimeEntry(activeEntry.id);
    }

    const entry =
        createTimeEntry({
            taskId
        });

    const savedEntry =
        await createTimeEntryInDb(entry);

    timeEntries.push(savedEntry);

    return savedEntry;
}

async function stopTimeEntry(entryId) {
    const entry = timeEntries.find(
        item => item.id === entryId
    );

    if (!entry) {
        return null;
    }

    if (entry.endedAt !== null) {
        return entry;
    }

    const previous = {
        ...entry
    };

    entry.endedAt = Date.now();

    try {
        const savedEntry =
            await updateTimeEntryInDb(entry);

        Object.assign(
            entry,
            savedEntry
        );

        return entry;
    } catch (error) {
        Object.assign(
            entry,
            previous
        );

        throw error;
    }
}

function stopActiveTimeEntry() {
    const entry =
        getActiveTimeEntry();

    if (!entry) {
        return Promise.resolve(null);
    }

    return stopTimeEntry(entry.id);
}

function clearTimeEntries() {
    timeEntries = [];
}


function getTimeEntriesByPeriod(
    from,
    to
) {
    const fromTime =
        from instanceof Date
            ? from.getTime()
            : from;

    const toTime =
        to instanceof Date
            ? to.getTime()
            : to;

    return timeEntries.filter(entry => {
        const entryEnd =
            entry.endedAt ?? Date.now();

        return (
            entry.startedAt <= toTime &&
            entryEnd >= fromTime
        );
    });
}




function getTaskDuration(taskId) {
    return getTimeEntriesByTask(taskId)
        .reduce(
            (total, entry) =>
                total +
                getTimeEntryDuration(entry),
            0
        );
}


async function updateTimeEntry(id, changes) {
    const entry = getTimeEntryById(id);
    if (!entry) return null;

    const previous = { ...entry };

    Object.assign(entry, changes);

    try {
        const savedEntry = await updateTimeEntryInDb(entry);

        Object.assign(entry, savedEntry);

        return entry;
    } catch (error) {
        Object.assign(entry, previous);
        throw error;
    }
}

function getTimeEntryById(id) {
    return timeEntries.find(entry => entry.id === id);
}