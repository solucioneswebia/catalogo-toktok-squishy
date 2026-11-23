import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://lxzwjwtifvizypofgsfg.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_n5pFFXGf1s-htE5Y2cx3Uw_nvVJ0kvA'
)

