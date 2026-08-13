// тестовый акк
// kddmts36@mailbinmart.com
// test123


async function signUp(email, password) {
    const { data, error } =
        await supabaseClient.auth.signUp({
            email,
            password
        });

    if (error) {
        throw error;
    }

    return data;
}

async function signIn(email, password) {
    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        throw error; 
    }

    return data;
}

async function signOut() {
    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        throw error;
    }
}

async function getCurrentUser() {
    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error) {
        throw error;
    }

    return data.user;
}

async function getCurrentSession() {
    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        throw error;
    }

    return data.session;
}