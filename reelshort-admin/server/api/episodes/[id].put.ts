// PUT /api/episodes/:id — 更新单集（绕过 RLS）
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const admin = useSupabaseAdmin()

  const { data, error } = await admin
    .from('episodes')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return data
})
