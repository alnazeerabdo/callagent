
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jrcfuhhcmqicwpmcmmps.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyY2Z1aGhjbXFpY3dwbWNtbXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTc5NTAsImV4cCI6MjA4MjQ5Mzk1MH0.QtevhVQqkWW-LbvHIIOaGtPG0EPqGtySlkS70GFCxsc'

export const supabase = createClient(supabaseUrl, supabaseKey)
