import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://xskypvahsbclqlkqlima.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_w1t-2GxtwXQVAuHYTT-eaA_74udQ4J7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
