// DELETE /api/episodes/:id — 删除单集（绕过 RLS）
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const admin = useSupabaseAdmin()

  const { error } = await admin
    .from('episodes')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { success: true }
})
