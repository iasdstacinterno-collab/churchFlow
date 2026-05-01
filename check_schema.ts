import { createClient } from './app/utils/supabase/client'
const supabase = createClient()
async function check() {
  const { data, error } = await supabase.from('schedules').select('*').limit(1)
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]))
  } else {
    console.log('No data found to check columns')
  }
}
check()
