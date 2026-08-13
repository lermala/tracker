console.log("AUTH TEST FILE LOADED");

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

async function testSignUp() {
    try {
        const result = await signUp(
            "kolodina.lera322@mail.ru",
            "TestPassword123!"
        );

        console.log("SIGN UP:", result);
    } catch (error) {
        console.error("SIGN UP ERROR:", error);
    }
}

// testSignUp();

async function testSignIn() {
    try {
        const result = await signIn(
            "kolodina.lera322@mail.ru",
            "TestPassword123!"
        );

        console.log("SIGN IN:", result);
    } catch (error) {
        console.error("SIGN IN ERROR:", error);
    }
}

// testSignIn();

async function testCurrentUser() {
    try {
        const user = await getCurrentUser();

        console.log("CURRENT USER:", user);
    } catch (error) {
        console.error("GET USER ERROR:", error);
    }
}

// testCurrentUser();

