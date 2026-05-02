import { createClient } from '@supabase/supabase-js'

async function checkImages() {
  const supabase = createClient(
    'https://gfxohsjjrfnqrlzgxmkn.supabase.co',
    'sb_publishable_MftUrEft5YjsEKVreudPcQ_-6J6Dp9O'
  )

  const { data: tours } = await supabase.from('tours').select('id, title, image_url')
  console.log('Tours and their image URLs:')
  tours?.forEach(t => {
    console.log(`- ${t.title}: ${t.image_url}`)
  })
}

checkImages()
