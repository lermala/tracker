const SUPABASE_URL =
    "https://ohdorgzxlfyepbsgxbjd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_D9GBSpTxL2qCo8TiXQuiIg_CW0jCkAy";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);