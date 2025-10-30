import { createClient } from '@supabase/supabase-js'

// This script creates admin users in Supabase
// Run with: npx tsx scripts/create-admin-user.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    })

    if (error) {
      console.error('Error creating admin user:', error.message)
      return false
    }

    console.log('✅ Admin user created successfully:', data.user?.email)
    return true
  } catch (err) {
    console.error('Unexpected error:', err)
    return false
  }
}

async function main() {
  console.log('🔐 Creating admin users...')
  
  // Create default admin user
  const adminEmail = 'admin@styragon.com'
  const adminPassword = 'StyragonAdmin2024!'
  
  const success = await createAdminUser(adminEmail, adminPassword)
  
  if (success) {
    console.log('\n🎉 Admin user setup complete!')
    console.log(`📧 Email: ${adminEmail}`)
    console.log(`🔑 Password: ${adminPassword}`)
    console.log('\n⚠️  Please change the password after first login!')
  } else {
    console.log('\n❌ Failed to create admin user')
  }
}

main().catch(console.error)
