// POST /api/episodes — 创建单集（绕过 RLS）
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const admin = useSupabaseAdmin()

  const { data, error } = await admin
    .from('episodes')
    .insert(body)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return data
})
