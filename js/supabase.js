const SUPABASE_URL = "https://qfzeqptvxkyusfjevgdo.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ir2FNiqbyf0INoPVvWQvGA_2-UtSYLm";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase conectado!");