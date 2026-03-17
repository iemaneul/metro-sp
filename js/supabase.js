import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = "https://mgebshvmmtrvckojcexa.supabase.co"

const SUPABASE_KEY = "sb_publishable_-TZ1GF54ZRyEmeuz5dTYmA_RwXpOPjD"

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)