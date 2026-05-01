import { createClient } from './app/utils/supabase/client'
const supabase = createClient()
async function run() {
  const { data, error } = await supabase.from('schedules').select('*').limit(1)
  console.log('Columns:', data ? Object.keys(data[0]) : 'No data')
}
run()
