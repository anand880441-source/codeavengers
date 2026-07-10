import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key';

// Only create client if we have real credentials
const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://dummy.supabase.co') 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export default supabase;
