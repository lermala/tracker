function createTimeEntryModel({
    id,
    taskId,
    userId,
    startedAt,
    endedAt = null,
    note = "",
    createdAt,
    updatedAt
}) {
    return {
        id,
        taskId,
        userId,
        startedAt,
        endedAt,
        note,
        createdAt,
        updatedAt
    };
}

function getTimeEntryDuration(entry) {
    const endedAt =
        entry.endedAt ?? Date.now();

    return Math.max(
        0,
        Math.floor(
            (endedAt - entry.startedAt) / 1000
        )
    );
}