import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// Replace with your own Supabase URL and anon key
const supabaseUrl = "https://ptrnucitxwoeuagjsvkn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0cm51Y2l0eHdvZXVhZ2pzdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODY0NTcsImV4cCI6MjA4MzU2MjQ1N30.vo4P2NaNvvArzwVSyAAuGCfDjTMlgQmjydIyYVF5kRE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
