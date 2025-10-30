import { createClient } from '@supabase/supabase-js'

// Usage: set env NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// Also set ADMIN_EMAIL and ADMIN_PASSWORD

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const adminEmail = process.env.ADMIN_EMAIL!
const adminPassword = process.env.ADMIN_PASSWORD!

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
if (!adminEmail) throw new Error('ADMIN_EMAIL is required')
if (!adminPassword) throw new Error('ADMIN_PASSWORD is required')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log(`Creating admin user: ${adminEmail}`)
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { role: 'admin' },
  })

  if (error) {
    console.error('Failed:', error.message)
    process.exit(1)
  }

  console.log('Created:', data.user?.id, data.user?.email)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


