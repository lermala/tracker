function timeEntryFromDb(row) {
    return createTimeEntryModel({
        id: row.id,
        taskId: row.task_id,
        userId: row.user_id,

        startedAt:
            new Date(row.started_at).getTime(),

        endedAt: row.ended_at
            ? new Date(row.ended_at).getTime()
            : null,

        note: row.note,

        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime()
    });
}

function timeEntryToDb(entry) {
    return {
        id: entry.id,
        task_id: entry.taskId,

        started_at:
            new Date(entry.startedAt).toISOString(),

        ended_at: entry.endedAt
            ? new Date(entry.endedAt).toISOString()
            : null,

        note: entry.note
    };
}

async function getTimeEntriesFromDb() {
    const { data, error } = await supabaseClient
        .from("time_entries")
        .select("*")
        .order("started_at");

    if (error) {
        throw error;
    }

    return data.map(timeEntryFromDb);
}

async function createTimeEntryInDb(entry) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("User is not authenticated");
    }

    const { data, error } = await supabaseClient
        .from("time_entries")
        .insert({
            ...timeEntryToDb(entry),
            user_id: user.id
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return timeEntryFromDb(data);
}

async function updateTimeEntryInDb(entry) {
    const row = timeEntryToDb(entry);

    delete row.id;
    delete row.user_id;

    const { data, error } = await supabaseClient
        .from("time_entries")
        .update(row)
        .eq("id", entry.id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return timeEntryFromDb(data);
}

async function deleteTimeEntryFromDb(id) {
    const { error } = await supabaseClient
        .from("time_entries")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
}