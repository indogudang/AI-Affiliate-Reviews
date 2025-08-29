import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yuzegntjptyycwvhotqu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1emVnbnRqcHR5eWN3dmhvdHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzQxMTMsImV4cCI6MjA3MjA1MDExM30.f3Lzx3YgfXZqR7frTxSItU8oAidNCT3Ylku59O9yXwo';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
